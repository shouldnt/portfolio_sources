import ScrollArea from './ScrollArea.js';
import Stage from './Panel.js';
$(document).ready(function() {

	new ScrollArea(); 

	new Stage(document.getElementById('stage'));
})