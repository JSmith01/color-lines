<template>
    <div
        :class="['cell', highlight ? 'highlight' : '']"
        v-on="$listeners"
    >
        <div :class="['ball', color, status]" />
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
        status: {
            default: '',
            type: String,
        },
        highlight: {
            default: false,
            type: Boolean,
        },
    },
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
    &.red {
        background: radial-gradient(circle at ($ball-size / 3) ($ball-size / 3), #ff4747, #000);
    }
    &.orange {
        background: radial-gradient(circle at ($ball-size / 3) ($ball-size / 3), #ffbb33, #000);
    }
    &.yellow {
        background: radial-gradient(circle at ($ball-size / 3) ($ball-size / 3), #ffff45, #000);
    }
    &.green {
        background: radial-gradient(circle at ($ball-size / 3) ($ball-size / 3), #4dff79, #000);
    }
    &.blue {
        background: radial-gradient(circle at ($ball-size / 3) ($ball-size / 3), #5cabff, #000);
    }
    &.darkblue {
        background: radial-gradient(circle at ($ball-size / 3) ($ball-size / 3), #5e5eff, #000);
    }
    &.purple {
        background: radial-gradient(circle at ($ball-size / 3) ($ball-size / 3), #e45eff, #000);
    }
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
    border-top: ($ball-size * 0.05) solid #f5f5f5;
    border-left: ($ball-size * 0.05) solid #f5f5f5;
    border-right: ($ball-size * 0.05) solid #ccc;
    border-bottom: ($ball-size * 0.05) solid #ccc;
    &.highlight {
        background-color: #eee9c3;
    }
}
</style>
