from app import create_app

# Create Flask app
app = create_app()

if __name__ == '__main__':
    # Run the app on port 5000
    app.run(host='0.0.0.0', port=5000, debug=True)
