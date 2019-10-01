module.exports = {
    props: ['currentPage', 'numberOfPages'],
    methods: {
        switchPage: function(n) {
            this.$emit('page-change', n)
        }
    },
    template: `
<ul class='flex items-center justify-center text-gray-400 font-semibold py-2'>
    <li class='inline-block flex items-center'>
        <a class='px-2 hover:cursor-pointer hover:text-white' 
        v-on:click="switchPage(currentPage-1)">
        <svg class='h-4 w-4 fill-current' aria-hidden="true" data-prefix="fas" data-icon="chevron-left" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
            <path fill="currentColor" d="M34.52 239.03L228.87 44.69a24 24 0 0 1 33.94 0l22.67 22.67a24 24 0 0 1 .04 33.9L131.49 256l154.02 154.75a24 24 0 0 1-.04 33.9l-22.67 22.67a24 24 0 0 1-33.94 0L34.52 272.97a24 24 0 0 1 0-33.94z"/>
        </svg>
    </a></li>
    <li class='inline-block flex items-center'><a class='px-2 hover:cursor-default' href="#">
        {{currentPage+1}} of {{numberOfPages}}
    </a></li>
    <li class='inline-block flex items-center'>
        <a class='px-2 hover:cursor-pointer hover:text-white' 
        v-on:click="switchPage(currentPage+1)">
        <svg class='h-4 w-4 fill-current' aria-hidden="true" data-prefix="fas" data-icon="chevron-right" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
            <path fill="currentColor" d="M285.48 272.97L91.13 467.31a24 24 0 0 1-33.94 0l-22.67-22.66a24 24 0 0 1-.04-33.9L188.5 256 34.48 101.25a24 24 0 0 1 .04-33.9L57.2 44.7a24 24 0 0 1 33.94 0l194.35 194.34a24 24 0 0 1 0 33.94z"/>
        </svg>
    </a></li>
</ul>
`
}