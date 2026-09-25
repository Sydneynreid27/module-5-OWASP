# module-5-OWASP



# 1. Broken Access Control (JavaScript)

### Vulnerability

The application allows any user to request any profile by changing the `userId` parameter. There is no authorization check to ensure the logged-in user owns the profile being accessed.

### Secure Code

```javascript
app.get('/profile/:userId', authenticateUser, (req, res) => {
    if (req.user.id !== req.params.userId) {
        return res.status(403).json({ message: 'Access denied' });
    }

    User.findById(req.params.userId, (err, user) => {
        if (err) return res.status(500).send(err);
        res.json(user);
    });
});
```

### Why This Fix Works

The code now verifies that the authenticated user matches the requested profile before returning data. Unauthorized users receive a 403 Forbidden response.

**OWASP Reference:** Broken Access Control (A01:2021)

---

# 2. Broken Access Control (Python)

### Vulnerability

Any user can retrieve another user's account information simply by changing the `user_id` value in the URL.

### Secure Code

```python
@app.route('/account/<user_id>')
@login_required
def get_account(user_id):
    if str(current_user.id) != user_id:
        return jsonify({"error": "Access denied"}), 403

    user = db.query(User).filter_by(id=user_id).first()
    return jsonify(user.to_dict())
```

### Why This Fix Works

The application verifies the logged-in user's identity before returning account information.

**OWASP Reference:** Broken Access Control (A01:2021)

---

# 3. Cryptographic Failures (Java)

### Vulnerability

MD5 is an outdated hashing algorithm that is vulnerable to collision attacks and should not be used for password storage.

### Secure Code

```java
public String hashPassword(String password) throws Exception {
    SecureRandom random = new SecureRandom();
    byte[] salt = new byte[16];
    random.nextBytes(salt);

    PBEKeySpec spec = new PBEKeySpec(
        password.toCharArray(),
        salt,
        65536,
        256
    );

    SecretKeyFactory factory =
        SecretKeyFactory.getInstance("PBKDF2WithHmacSHA256");

    byte[] hash = factory.generateSecret(spec).getEncoded();

    return Base64.getEncoder().encodeToString(hash);
}
```

### Why This Fix Works

PBKDF2 uses salting and multiple iterations, making password cracking significantly more difficult than MD5.

**OWASP Reference:** Cryptographic Failures (A02:2021)

---

# 4. Cryptographic Failures (Python)

### Vulnerability

SHA-1 is considered broken for password storage and is vulnerable to attacks.

### Secure Code

```python
import bcrypt

def hash_password(password):
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(password.encode(), salt)
```

### Why This Fix Works

bcrypt automatically salts passwords and uses a work factor that slows down brute-force attacks.

**OWASP Reference:** Cryptographic Failures (A02:2021)

---

# 5. Injection (SQL Injection)

### Vulnerability

The application directly inserts user input into an SQL query, allowing attackers to manipulate the query.

### Secure Code

```java
String username = request.getParameter("username");

PreparedStatement stmt =
    connection.prepareStatement(
        "SELECT * FROM users WHERE username = ?"
    );

stmt.setString(1, username);

ResultSet rs = stmt.executeQuery();
```

### Why This Fix Works

Prepared statements separate SQL commands from user input, preventing malicious SQL code from being executed.

**OWASP Reference:** Injection (A03:2021)

---

# 6. Injection (NoSQL Injection)

### Vulnerability

User input is passed directly into the database query without validation.

### Secure Code

```javascript
app.get('/user', (req, res) => {
    const username = String(req.query.username);

    db.collection('users').findOne(
        { username: username },
        (err, user) => {
            if (err) return res.status(500).send(err);
            res.json(user);
        }
    );
});
```

### Why This Fix Works

Input validation ensures only expected string values are processed, reducing the risk of NoSQL injection.

**OWASP Reference:** Injection (A03:2021)

---

# 7. Insecure Design

### Vulnerability

Anyone who knows an email address can reset that user's password without verification.

### Secure Code

```python
@app.route('/reset-password', methods=['POST'])
def reset_password():
    token = request.form['token']
    new_password = request.form['new_password']

    user = verify_reset_token(token)

    if not user:
        return "Invalid token", 403

    user.password = hash_password(new_password)
    db.session.commit()

    return "Password reset successful"
```

### Why This Fix Works

Password resets now require a valid reset token and the new password is securely hashed before storage.

**OWASP Reference:** Insecure Design (A04:2021)

---

# 8. Software and Data Integrity Failures

### Vulnerability

The application loads JavaScript from a CDN without verifying its integrity. If the CDN is compromised, malicious code could be executed.

### Secure Code

```html
<script
  src="https://cdn.example.com/lib.js"
  integrity="sha384-oqVuAfXRKap7fdgcCY5uykM6+R9GqQ8K/uxk9O+OGpamoFVy38MVBnE+IbbVYUew"
  crossorigin="anonymous">
</script>
```

### Why This Fix Works

Subresource Integrity (SRI) ensures the browser only loads files that match the expected cryptographic hash.

**OWASP Reference:** Software and Data Integrity Failures (A08:2021)

---

# 9. Server-Side Request Forgery (SSRF)

### Vulnerability

The application allows users to supply any URL, potentially accessing internal services or sensitive resources.

### Secure Code

```python
import requests

ALLOWED_DOMAINS = ["example.com"]

url = input("Enter URL: ")

if any(domain in url for domain in ALLOWED_DOMAINS):
    response = requests.get(url, timeout=5)
    print(response.text)
else:
    print("URL not allowed")
```

### Why This Fix Works

The application restricts requests to approved domains and limits request time, reducing SSRF risks.

**OWASP Reference:** SSRF (A10:2021)

---

# 10. Identification and Authentication Failures

### Vulnerability

Passwords appear to be stored and compared in plaintext.

### Secure Code

```java
if (BCrypt.checkpw(inputPassword,
                   user.getPasswordHash())) {
    // Login success
}
```

### Why This Fix Works

Passwords are stored as bcrypt hashes instead of plaintext. During login, the entered password is compared against the stored hash, protecting user credentials even if the database is compromised.

**OWASP Reference:** Identification and Authentication Failures (A07:2021)
