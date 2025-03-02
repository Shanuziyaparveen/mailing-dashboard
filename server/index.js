require('dotenv').config();
console.log('Testing dotenv:', process.env.TEST_ENV);

const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const { Low } = require('lowdb');
const { JSONFile } = require('lowdb/node');

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Middleware
app.use(cors());
app.use(express.json());

// Database setup



const adapter = new JSONFile('server/db.json');
const db = new Low(adapter);

// Initialize database with default data
const initializeDb = async () => {
  await db.read();
  
  // Set default data if db is empty
  db.data ||= { 
    users: [],
    mails: []
  };
  
  // Add a default user if none exists
  if (db.data.users.length === 0) {
    const hashedPassword = await bcrypt.hash('password123', 10);
    db.data.users.push({
      id: uuidv4(),
      name: 'John Doe',
      email: 'john@example.com',
      password: hashedPassword,
      createdAt: new Date().toISOString()
    });
  }
  
  // Generate mock emails if none exist
  if (db.data.mails.length === 0) {
    const folders = ['inbox', 'sent', 'drafts', 'junk', 'trash', 'archive'];
    const labels = ['work', 'personal', 'important', 'social'];
    
    // Generate 50 mock emails
    for (let i = 1; i <= 50; i++) {
      const folder = folders[Math.floor(Math.random() * folders.length)];
      const labelIndices = Array.from(
        { length: Math.floor(Math.random() * 3) }, 
        () => Math.floor(Math.random() * labels.length)
      );
      const mailLabels = [...new Set(labelIndices)].map(index => labels[index]);
      
      db.data.mails.push({
        id: `mail-${i}`,
        subject: `Mail Subject ${i}`,
        from: {
          name: `Sender ${i}`,
          email: `sender${i}@example.com`,
        },
        to: [
          {
            name: 'John Doe',
            email: 'john@example.com',
          },
        ],
        date: new Date(Date.now() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000)).toISOString(),
        body: `This is the body of email ${i}. It contains some text that would typically be in an email. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisl eget aliquam ultricies, nunc nisl aliquet nunc, quis aliquam nisl nunc eu nisl.`,
        read: Math.random() > 0.5,
        labels: mailLabels,
        folder,
        attachments: Math.random() > 0.7 ? [
          {
            name: `attachment-${i}.pdf`,
            size: Math.floor(Math.random() * 1000000),
            type: 'application/pdf',
          },
        ] : undefined,
        userId: db.data.users[0].id // Assign to default user
      });
    }
  }
  
  await db.write();
};

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized: No token provided' });
  }
  
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Forbidden: Invalid token' });
    }
    req.user = user;
    next();
  });
};

// Routes
// Register new user
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    await db.read();
    
    // Check if user already exists
    const existingUser = db.data.users.find(user => user.email === email);
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create new user
    const newUser = {
      id: uuidv4(),
      name,
      email,
      password: hashedPassword,
      createdAt: new Date().toISOString()
    };
    
    db.data.users.push(newUser);
    await db.write();
    
    // Generate JWT token
    const token = jwt.sign(
      { id: newUser.id, email: newUser.email, name: newUser.name },
      JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    // Return user info and token (excluding password)
    const { password: _, ...userWithoutPassword } = newUser;
    res.status(201).json({
      user: userWithoutPassword,
      token
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
});

// Login user
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    await db.read();
    
    // Find user
    const user = db.data.users.find(user => user.email === email);
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    
    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    
    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name },
      JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    // Return user info and token (excluding password)
    const { password: _, ...userWithoutPassword } = user;
    res.status(200).json({
      user: userWithoutPassword,
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// Get user profile
app.get('/api/auth/profile', authenticateToken, async (req, res) => {
  try {
    await db.read();
    
    const user = db.data.users.find(user => user.id === req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    const { password, ...userWithoutPassword } = user;
    res.status(200).json(userWithoutPassword);
  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({ message: 'Server error fetching profile' });
  }
});

// Get all emails for the authenticated user
app.get('/api/mails', authenticateToken, async (req, res) => {
  try {
    await db.read();
    
    const userMails = db.data.mails.filter(mail => 
      mail.userId === req.user.id || 
      mail.to.some(recipient => recipient.email === req.user.email)
    );
    
    res.status(200).json(userMails);
  } catch (error) {
    console.error('Get mails error:', error);
    res.status(500).json({ message: 'Server error fetching mails' });
  }
});

// Get a specific email
app.get('/api/mails/:id', authenticateToken, async (req, res) => {
  try {
    await db.read();
    
    const mail = db.data.mails.find(mail => mail.id === req.params.id);
    
    if (!mail) {
      return res.status(404).json({ message: 'Mail not found' });
    }
    
    // Check if user has access to this email
    if (mail.userId !== req.user.id && !mail.to.some(recipient => recipient.email === req.user.email)) {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    res.status(200).json(mail);
  } catch (error) {
    console.error('Get mail error:', error);
    res.status(500).json({ message: 'Server error fetching mail' });
  }
});

// Mark email as read
app.patch('/api/mails/:id/read', authenticateToken, async (req, res) => {
  try {
    await db.read();
    
    const mailIndex = db.data.mails.findIndex(mail => mail.id === req.params.id);
    
    if (mailIndex === -1) {
      return res.status(404).json({ message: 'Mail not found' });
    }
    
    // Check if user has access to this email
    const mail = db.data.mails[mailIndex];
    if (mail.userId !== req.user.id && !mail.to.some(recipient => recipient.email === req.user.email)) {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    // Update read status
    db.data.mails[mailIndex].read = true;
    await db.write();
    
    res.status(200).json(db.data.mails[mailIndex]);
  } catch (error) {
    console.error('Mark as read error:', error);
    res.status(500).json({ message: 'Server error updating mail' });
  }
});

// Move email to a different folder
app.patch('/api/mails/:id/move', authenticateToken, async (req, res) => {
  try {
    const { folder } = req.body;
    
    if (!folder) {
      return res.status(400).json({ message: 'Folder is required' });
    }
    
    await db.read();
    
    const mailIndex = db.data.mails.findIndex(mail => mail.id === req.params.id);
    
    if (mailIndex === -1) {
      return res.status(404).json({ message: 'Mail not found' });
    }
    
    // Check if user has access to this email
    const mail = db.data.mails[mailIndex];
    if (mail.userId !== req.user.id && !mail.to.some(recipient => recipient.email === req.user.email)) {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    // Update folder
    db.data.mails[mailIndex].folder = folder;
    await db.write();
    
    res.status(200).json(db.data.mails[mailIndex]);
  } catch (error) {
    console.error('Move mail error:', error);
    res.status(500).json({ message: 'Server error moving mail' });
  }
});

// Delete email (move to trash)
app.delete('/api/mails/:id', authenticateToken, async (req, res) => {
  try {
    await db.read();
    
    const mailIndex = db.data.mails.findIndex(mail => mail.id === req.params.id);
    
    if (mailIndex === -1) {
      return res.status(404).json({ message: 'Mail not found' });
    }
    
    // Check if user has access to this email
    const mail = db.data.mails[mailIndex];
    if (mail.userId !== req.user.id && !mail.to.some(recipient => recipient.email === req.user.email)) {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    // Move to trash instead of deleting
    db.data.mails[mailIndex].folder = 'trash';
    await db.write();
    
    res.status(200).json({ message: 'Mail moved to trash' });
  } catch (error) {
    console.error('Delete mail error:', error);
    res.status(500).json({ message: 'Server error deleting mail' });
  }
});

// Start server
(async () => {
  try {
    await initializeDb();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Server initialization error:', error);
  }
})();