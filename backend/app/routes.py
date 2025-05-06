from flask import Blueprint, jsonify

main_routes = Blueprint('main', __name__)

@main_routes.route('/')
def home():
    return jsonify(message="Welcome to SankatMochan API!")

@main_routes.route('/tools', methods=['GET'])
def get_tools():
    # Placeholder for returning AI tools data
    tools = [
        {"name": "Tool 1", "description": "AI tool 1 description"},
        {"name": "Tool 2", "description": "AI tool 2 description"}
    ]
    return jsonify(tools=tools)
