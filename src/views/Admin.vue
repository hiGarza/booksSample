<template>
    <div id="app">
        <div>
            <input type="text" v-model="newBookName" placeholder="Name">
            <input type="text" v-model="newBookAuthor" placeholder="Author">
            <input type="text" v-model="newBookDesc" placeholder="Description">
            <input type="text" v-model="newBookPrice" placeholder="Price">
            <b-button @click="addBook">
                Save Book
            </b-button>
        </div>
        <b-table-simple hover small caption-top responsive>
            <b-thead head-variant="dark">
                <b-tr>
                    <b-th>In Stock?</b-th>
                    <b-th>Name</b-th>
                    <b-th>Author</b-th>
                    <b-th>Description</b-th>
                    <b-th>Price</b-th>
                    <b-th></b-th>
                </b-tr>
            </b-thead>
            <b-tbody>
                <b-tr v-for="(book, i) in books" :key="i">
                    <b-td>{{book.stock}}</b-td>
                    <b-th>{{book.name}}</b-th>
                    <b-td>{{book.author}}</b-td>
                    <b-td>{{book.description}}</b-td>
                    <b-td>{{book.price}}</b-td>
                    <b-td>
                        <b-button @click="deleteBook(book)">
                            Remove
                        </b-button>
                    </b-td>
                </b-tr>
            </b-tbody>
        </b-table-simple>
    </div>
</template>
<script>
import { db } from '../firebase';

export default {
    data() {
        return {
            books: [],
            newBookName: '',
            newBookAuthor: '',
            newBookDesc: '',
            newBookPrice: ''
        }
    },
    firestore() {
        return {
            books: db.collection('books'),
        }
    },
    methods: {
        addBook: function() {
            this.$firestore.books.add({
                name: this.newBookName,
                author: this.newBookAuthor,
                description: this.newBookDesc,
                price: this.newBookPrice,
                stock: 1
            });
            this.newBookName = ''
            this.newBookAuthor = ''
            this.newBookDesc = ''
            this.newBookPrice = ''
        },
        deleteBook: function(book) {
            this.$firestore.books.doc(book['.key']).delete();
        }
    }
}
</script>
<style>
#app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
}

.bookList {
    list-style: none;
}
</style>