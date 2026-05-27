const axios = require('axios');

const client = axios.create({baseURL:'http://localhost:5000'});

async function getAllBooks(callback) {
  try {
    const response = await client.get('/');
    callback(null, response.data);
  } catch (error) {
    callback(error, null);
  }
}

function searchByISBN(isbn) {
  return new Promise((resolve, reject) => {
    client.get(`/isbn/${isbn}`)
      .then(response => resolve(response.data))
      .catch(error => reject(error));
  });
}

function searchByAuthor(author) {
  return new Promise((resolve, reject) => {
    client.get(`/author/${encodeURIComponent(author)}`)
      .then(response => resolve(response.data))
      .catch(error => reject(error));
  });
}

function searchByTitle(title) {
  return new Promise((resolve, reject) => {
    client.get(`/title/${encodeURIComponent(title)}`)
      .then(response => resolve(response.data))
      .catch(error => reject(error));
  });
}

async function main() {
  console.log('Task 10: Get all books using async/callback');
  getAllBooks((err, data) => {
    if (err) {
      console.error('Error:', err.message);
    } else {
      console.log('Books count:', Object.keys(data).length);
      console.log(JSON.stringify(data, null, 2));
    }
  });

  await new Promise(resolve => setTimeout(resolve, 1000));

  console.log('\nTask 11: Search by ISBN using Promises');
  searchByISBN(1)
    .then(data => {
      console.log('ISBN 1 result:');
      console.log(JSON.stringify(data, null, 2));
    })
    .catch(error => console.error('Error:', error.message));

  await new Promise(resolve => setTimeout(resolve, 1000));

  console.log('\nTask 12: Search by Author using Promises');
  searchByAuthor('Austen')
    .then(data => {
      console.log('Author "Austen" results:');
      console.log(JSON.stringify(data, null, 2));
    })
    .catch(error => console.error('Error:', error.message));

  await new Promise(resolve => setTimeout(resolve, 1000));

  console.log('\nTask 13: Search by Title using Promises');
  searchByTitle('Divine')
    .then(data => {
      console.log('Title "Divine" results:');
      console.log(JSON.stringify(data, null, 2));
    })
    .catch(error => console.error('Error:', error.message));
}

main();