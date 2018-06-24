<template>
    <div class="hello">
        <h1>{{ msg }}</h1>
        <GameField />
    </div>
</template>

<script>
import GameField from './GameField';

export default {
    name: 'MainMenu',
    components: { GameField },
    data() {
        return {
            msg: 'Color Lines',
        };
    },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
    font-weight: normal;
}

ul {
    list-style-type: none;
    padding: 0;
}

li {
    display: inline-block;
    margin: 0 10px;
}

a {
    color: #42b983;
}
</style>
