<template>
    <div>
        <b-row>
            <b-col cols="4" v-for="(book, i) in sortedByStock" :key="i" class="mt-4">
                <b-card :title="book.name" :sub-title="book.author" :img-src="'https://picsum.photos/600/300/?image='+Math.floor(Math.random() * 15)" img-top tag="article" footer-tag="footer">
                    <b-card-text style="height: 150px;">
                        {{book.description}}
                    </b-card-text>
                    <template #footer>
                        <div>
                            <span style="float:left;">${{book.price}}</span>
                            <b-button style="float:right;" href="#" variant="primary" :disabled="book.stock<1" @click="$router.push({name: 'Payment', params: { id: book['.key'] }})">{{book.stock>0?'Buy':'Out of Stock'}}</b-button>
                        </div>
                    </template>
                </b-card>
            </b-col>
        </b-row>
        <b-button class="mt-2" @click="$router.push({name: 'Admin'})">Admin Panel</b-button>
    </div>
</template>
<script>
import { db } from '../firebase';

export default {
    computed: {
        sortedByStock: function() {
            function compare(a, b) {
                if (a.stock < b.stock)
                    return -1;
                if (a.stock > b.stock)
                    return 1;
                return 0;
            }

            return this.books.slice().sort(compare).reverse();
        }
    },
    data() {
        return {
            books: []
        }
    },
    firestore() {
        return {
            books: db.collection('books'),
        }
    },
    methods: {}
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