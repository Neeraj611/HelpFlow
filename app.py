from flask import Flask, render_template, request, redirect, url_for, session, jsonify
from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__)
app.secret_key = "your_secret_key"

# In-memory storage
users = []
users.append({
    'name': 'Admin',
    'email': 'admin@helpflow.com',
    'password': generate_password_hash('admin123'),
    'role': 'Admin'
})

tickets = []

@app.route('/')
def home():
    return render_template('index.html')

# ---------------- Register ----------------
@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        name = request.form['name']
        email = request.form['email']
        password = request.form['password']
        confirm = request.form['confirmPassword']

        if password != confirm:
            return "Passwords do not match"
        if any(user['email'] == email for user in users):
            return "User already exists"

        users.append({
            'name': name,
            'email': email,
            'password': generate_password_hash(password),
            'role': 'End User'
        })

        return redirect(url_for('login'))
    return render_template('register.html')

# ---------------- Login ----------------
@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        email = request.form['email']
        password = request.form['password']

        user = next((u for u in users if u['email'] == email), None)
        if not user or not check_password_hash(user['password'], password):
            return "Invalid email or password"

        session['user'] = {
            'name': user['name'],
            'email': user['email'],
            'role': user['role']
        }

        return redirect(url_for('dashboard'))
    return render_template('login.html')

# ---------------- Logout ----------------
@app.route('/logout')
def logout():
    session.pop('user', None)
    return redirect(url_for('login'))

# ---------------- Profile ----------------
@app.route('/profile')
def profile():
    if 'user' not in session:
        return redirect(url_for('login'))
    return render_template('profile.html', user=session['user'])

# ---------------- Dashboard ----------------
@app.route('/dashboard')
def dashboard():
    if 'user' not in session:
        return redirect(url_for('login'))
    
    # Only show tickets of the logged-in user
    user_tickets = [t for t in tickets if t['email'] == session['user']['email']]
    return render_template('dashboard.html', user=session['user'], tickets=user_tickets)


# ---------------- Admin Panel ----------------
@app.route('/admin')
def admin():
    if 'user' not in session or session['user']['role'].lower() != 'admin':
        return redirect(url_for('dashboard'))
    return render_template('admin.html', user=session['user'])

# ---------------- Agent Panel ----------------
@app.route('/agent')
def agent():
    if 'user' not in session or session['user']['role'].lower() not in ['agent', 'support agent']:
        return redirect(url_for('dashboard'))
    return render_template('agent.html', user=session['user'])

# ---------------- Create Ticket ----------------
@app.route('/create-ticket', methods=['GET', 'POST'])
def create_ticket():
    if 'user' not in session:
        return redirect(url_for('login'))

    if request.method == 'POST':
        ticket = {
            'id': len(tickets) + 1,
            'question': request.form['question'],
            'description': request.form['description'],
            'category': request.form['category'],
            'tags': request.form['tags'],
            'author': session['user']['name'],
            'email': session['user']['email'],
            'status': 'Open',
            'solved': False,
            'replies': []
        }
        tickets.append(ticket)
        return redirect(url_for('dashboard'))

    return render_template('create_ticket.html', user=session['user'])

# ---------------- Ticket Detail ----------------
@app.route('/ticket/<int:ticket_id>', methods=['GET', 'POST'])
def ticket_detail(ticket_id):
    if 'user' not in session:
        return redirect(url_for('login'))

    ticket = next((t for t in tickets if t['id'] == ticket_id), None)
    if not ticket:
        return "Ticket not found"

    if request.method == 'POST':
        reply = request.form['replyMessage']
        ticket['replies'].append({
            'author': session['user']['name'],
            'message': reply
        })

    return render_template('ticket.html', ticket=ticket, user=session['user'])

if __name__ == '__main__':
    app.run(debug=True)
