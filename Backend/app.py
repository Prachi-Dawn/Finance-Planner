from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3

app = Flask(__name__)
CORS(app)

DB = "database.db"

def get_db():
    conn = sqlite3.connect(DB)
    conn.row_factory = sqlite3.Row
    return conn


@app.route("/")
def home():
    return "Finance-Planner Backend Running"


# TRANSACTIONS


@app.route("/transactions", methods=["GET"])
def get_transactions():

    conn = get_db()

    transactions = conn.execute(
        "SELECT * FROM transactions ORDER BY id DESC"
    ).fetchall()

    conn.close()

    return jsonify([dict(row) for row in transactions])


@app.route("/transactions", methods=["POST"])
def add_transaction():

    data = request.json

    amount = data["amount"]
    category = data["category"]
    ttype = data["type"]

    conn = get_db()

    conn.execute(
        """
        INSERT INTO transactions
        (amount, category, type)
        VALUES (?, ?, ?)
        """,
        (amount, category, ttype)
    )

    conn.commit()
    conn.close()

    return jsonify({"message": "Transaction Added"})


# DEBTS

@app.route("/debts", methods=["GET"])
def get_debts():

    conn = get_db()

    debts = conn.execute(
        "SELECT * FROM debts ORDER BY id DESC"
    ).fetchall()

    conn.close()

    return jsonify([dict(row) for row in debts])


@app.route("/debts", methods=["POST"])
def add_debt():

    data = request.json

    friend_name = data["friend_name"]
    amount = data["amount"]
    debt_type = data["debt_type"]

    conn = get_db()

    conn.execute(
        """
        INSERT INTO debts
        (friend_name, amount, debt_type)
        VALUES (?, ?, ?)
        """,
        (friend_name, amount, debt_type)
    )

    conn.commit()
    conn.close()

    return jsonify({"message": "Debt Added"})

@app.route("/debts/<int:id>/settle", methods=["PUT"])
def settle_debt(id):

    conn = get_db()

    conn.execute(
        """
        UPDATE debts
        SET status='Settled'
        WHERE id=?
        """,
        (id,)
    )

    conn.commit()
    conn.close()

    return jsonify({"message": "Debt Settled"})

if __name__ == "__main__":
    app.run(debug=True)