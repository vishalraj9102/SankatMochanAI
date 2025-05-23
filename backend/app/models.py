from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class Tool(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    description = db.Column(db.String(200), nullable=False)

    def __repr__(self):
        return f"<Tool {self.name}>"
