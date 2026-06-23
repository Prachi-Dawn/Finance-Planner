import sqlite3

conn = sqlite3.connect("database.db")

cursor = conn.cursor()

# Personal transactions
cursor.execute("""
CREATE TABLE IF NOT EXISTS transactions(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    amount REAL NOT NULL,
    category TEXT NOT NULL,
    type TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
""")

# borrowed
cursor.execute("""
CREATE TABLE IF NOT EXISTS friends(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL
)
""")

# Money owed
cursor.execute("""
CREATE TABLE IF NOT EXISTS debts(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    friend_name TEXT NOT NULL,
    amount REAL NOT NULL,
    debt_type TEXT NOT NULL,
    status TEXT DEFAULT 'Pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
""")

conn.commit()
conn.close()

print("Database created ")