# Required Imports
import os
from flask import Flask, request, jsonify
import uuid
from firebase_admin import credentials, firestore, initialize_app
from flask_cors import CORS
from flask_cors import cross_origin
import time

# Initialize Flask App
app = Flask(__name__)

CORS(app)

CORS(app, origins=["http://localhost:3000"])


# Initialize Firestore DB
cred = credentials.Certificate('key.json')
default_app = initialize_app(cred)
db = firestore.client()
inventory_ref = db.collection('inventory')
orders_ref = db.collection('orders')



@app.route('/addInventory', methods=['POST'])
@cross_origin(origins=["http://localhost:3000"]) 
def create():
    """
        create() : Add document to Firestore collection with request body
        Ensure you pass a custom ID as part of json body in post request
    """
    try:
        id = str(uuid.uuid4())
        request.json['id'] = id
        inventory_ref.document(id).set(request.json)
        print(request.json)
        return jsonify({"success": True}), 200
    except Exception as e:
        return jsonify({"success": False, "message": f"An Error Occured: {e}"}), 200 

@app.route('/placeorder', methods=['POST'])
@cross_origin(origins=["http://localhost:3000"]) 
def place_order():
    try:
        order_data = request.json.get('order_items', [])
        
        order_id = str(uuid.uuid4())
        timestamp = time.time()
        orders_ref.document(order_id).set({"order_id": order_id, "order_items": order_data, 'timestamp': timestamp})
        
        for item in order_data:
            item_id = item['item_id']
            quantity = item['quantity']

            print(item_id,quantity)

            # Fetch the document from the inventory collection
            inventory_doc = inventory_ref.document(item_id).get()
            print(inventory_doc)
            if inventory_doc.exists:
                print(inventory_doc.to_dict())
                current_quantity = int(inventory_doc.to_dict().get('stock', 0))
                new_quantity = max(0, current_quantity - int(quantity))
                print(current_quantity,new_quantity)
                
                # Update the inventory count in the database
                inventory_ref.document(item_id).update({'stock': new_quantity})
            else:
                return jsonify({"success": False, "message": f"Item with ID {item_id} not found in inventory"}), 404

        return jsonify({"success": True, "message": "Order placed successfully"}), 200
    except Exception as e:
        return jsonify({"success": False, "message": f"An Error Occurred: {e}"}), 200

@app.route('/list', methods=['GET'])
@cross_origin(origins=["http://localhost:3000"]) 
def read():
    """
        read() : Fetches documents from Firestore collection as JSON
        todo : Return document that matches query ID
        all_inventory : Return all documents
    """
    try:
        # Check if ID was passed to URL query
        todo_id = request.args.get('id')    
        if todo_id:
            todo = inventory_ref.document(todo_id).get()
            return jsonify(todo.to_dict()), 200
        else:
            all_inventory = [doc.to_dict() for doc in inventory_ref.stream()]
            return jsonify(all_inventory), 200
    except Exception as e:
        return f"An Error Occured: {e}"
    
@app.route('/getOrders', methods=['GET'])
@cross_origin(origins=["http://localhost:3000"]) 
def readOrders():
    """
        read() : Fetches documents from Firestore collection as JSON
        todo : Return document that matches query ID
        all_orders : Return all documents
    """
    try:
        # Check if ID was passed to URL query
        todo_id = request.args.get('id')    
        if todo_id:
            todo = orders_ref.document(todo_id).get()
            return jsonify(todo.to_dict()), 200
        else:
            all_orders = [doc.to_dict() for doc in orders_ref.stream()]
            return jsonify(all_orders), 200
    except Exception as e:
        return f"An Error Occured: {e}"


@app.route('/update', methods=['POST', 'PUT'])
@cross_origin(origins=["http://localhost:3000"]) 
def update():
    """
        update() : Update document in Firestore collection with request body
        Ensure you pass a custom ID as part of json body in post request
    """
    try:
        id = request.json['id']
        inventory_ref.document(id).update(request.json)
        return jsonify({"success": True}), 200
    except Exception as e:
        return f"An Error Occured: {e}"


@app.route('/delete', methods=['GET', 'DELETE'])
@cross_origin(origins=["http://localhost:3000"]) 
def delete():
    """
        delete() : Delete a document from Firestore collection
    """
    try:
        # Check for ID in URL query
        todo_id = request.args.get('id')
        inventory_ref.document(todo_id).delete()
        return jsonify({"success": True}), 200
    except Exception as e:
        return f"An Error Occured: {e}"
port = int(os.environ.get('PORT', 8081))


if __name__ == '__main__':
    app.run(threaded=True, host='0.0.0.0', port=port)