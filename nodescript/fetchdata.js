const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

// MongoDB connection string
const MONGO_URI = '';


const CommentSchema = new mongoose.Schema({
  content: String,
  timestamp: Date,
});

const Comment = mongoose.model('Comment', CommentSchema);

async function fetchDataAndCreateMd() {
  try {
    await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to MongoDB');

    const comments = await Comment.find({}).sort({ timestamp: -1 });

    let mdContent = '# Comments Database\n\n';
    comments.forEach((comment, index) => {
      mdContent += `## Comment ${index + 1}\n\n`;
      mdContent += `Content: ${comment.content}\n\n`;
      mdContent += `Timestamp: ${comment.timestamp}\n\n`;
    });

    const filename = `data.md`;
    const outputPath = path.join('/home/ubuntu/gaianet', filename);
    fs.writeFileSync(outputPath, mdContent);
    console.log(`Markdown file created: ${outputPath}`);

    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Error:', error);
  }
}

fetchDataAndCreateMd();