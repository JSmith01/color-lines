<template>
    <div
        :class="['cell', highlight ? 'highlight' : '']"
        v-on="$listeners"
    >
        <div :class="cellStyles" />
    </div>
</template>

<script>
export default {
    name: 'Cell',

    props: {
        color: {
            required: true,
            type: String,
        },
        small: {
            default: false,
            type: Boolean,
        },
        jump: {
            default: false,
            type: Boolean,
        },
        vanish: {
            default: false,
            type: Boolean,
        },
        highlight: {
            default: false,
            type: Boolean,
        },
    },

    computed: {
        cellStyles() {
            return 'ball ' + (this.color || 'empty') + (this.small ? ' small' : '') + (this.jump ? ' jump' : '')
                + (this.vanish ? ' vanish' : '');
        }
    }
};
</script>

<style lang="scss">
$ball-size: 8vh;

.ball {
    display: inline-block;
    background: black;
    border-radius: 50%;
    height: $ball-size;
    width: $ball-size;
    transform: translate(0, 5%);
    transform-origin: 50% 50%;
    &.empty {
        visibility: hidden;
    }
    @mixin ball-color($rgb) {
        background: radial-gradient(circle at ($ball-size / 3) ($ball-size / 3), $rgb, #000);
    }
    &.red { @include ball-color(#ff4747); }
    &.orange { @include ball-color(#ffbb33); }
    &.yellow { @include ball-color(#ffff45); }
    &.green { @include ball-color(#4dff79); }
    &.blue { @include ball-color(#5cabff); }
    &.darkblue { @include ball-color(#5e5eff); }
    &.purple { @include ball-color(#e45eff); }
    &.small {
        transform: scale(0.33) translateY(15%);
        opacity: 0.5;
    }
    @keyframes jump {
        0%   {transform: translate(0, 0) scale(1, 1);}
        40%  {transform: translate(0, 3%) scale(1, 1.05);}
        100% {transform: translate(0, 12%) scale(1.05, .95);}
    }
    @keyframes vanish {
        0%   {opacity: 1;}
        100% {opacity: 0;}
    }
    &.jump {
        animation: jump .5s linear alternate infinite;
    }
    &.vanish {
        animation: vanish .5s linear forwards;
    }
}

.cell {
    display: inline-block;
    width: ($ball-size * 1.2);
    height: ($ball-size * 1.2);
    text-align: center;
    background-color: #eee;
    box-sizing: border-box;
    border: ($ball-size * 0.05) solid #f5f5f5;
    border-right-color: #ccc;
    border-bottom-color: #ccc;
    &.highlight {
        background-color: #eee9c3;
    }
}
</style>
