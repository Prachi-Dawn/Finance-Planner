# cleanup.py

import sqlite3

conn = sqlite3.connect("database.db")

cursor = conn.cursor()

cursor.execute("""
DELETE FROM transactions
WHERE category = ''
OR category IS NULL
""")

conn.commit()

print("Deleted:", cursor.rowcount)

conn.close()