const requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
                            window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

const cancelAnimationFrame = window.cancelAnimationFrame || window.mozCancelAnimationFrame;

let svg_path = $('#path')[0];
let circle = $('#circle')[0];
let rect = $('#rectangle')[0];

const b = 0.1;	
const o = 0;
const w = Math.sqrt(1- Math.pow(b,2));

const DURATION =100;
const STEP = 5;

let animationId = 0;
let start;

let x_pos = 0;
let y_pos = 0;

let dot_x_pos = 50;
let dot_y_pos = 300;


function f1(x){
	return 5*Math.pow(Math.E,-b*x)
}

function createDots(x){
	return f1(x)*Math.cos(.5*w*x + o);
}

function getSlope(){
	console.log('(' + x_pos  + ', ' + y_pos + '),(' + dot_x_pos + ', ' + dot_y_pos +')');
	return (y_pos - dot_y_pos)/(x_pos - dot_x_pos);
}

function getDotYPos(x) {

	if(dot_y_pos == y_pos)
		return dot_y_pos;

	let slope = getSlope();

	if(y_pos < dot_y_pos){
		if(slope > 0)
			slope = - slope;
	}else{
		if(slope < 0)
			slope = - slope;
	}
	console.log(slope);

	return slope*(x + STEP) - slope*dot_x_pos + dot_y_pos;
}

function getDotXPos(){

	if(x_pos > dot_x_pos){
		if(dot_x_pos + STEP > x_pos )
			return x_pos;
		return dot_x_pos = dot_x_pos + STEP;
	}

	if(x_pos < dot_x_pos){
		if(dot_x_pos - STEP < x_pos )
			return x_pos;
		return dot_x_pos = dot_x_pos - STEP;
	}

	return x_pos;
}


function bounce(path, x, y, i){
	if( i < DURATION){

		dot_x_pos = (createDots(i)*0.25*x)+50;
		dot_y_pos = (createDots(i)*0.3*y)+300;

		path.setAttribute('d','M 50 0 Q ' + dot_x_pos + ' ' + dot_y_pos +' 50 600');
		
		//path.setAttribute('d','M 50 0 Q ' + ((createDots(i)*0.25*x)+50) + ' ' + ((createDots(i)*0.3*y)+300) +' 50 600');

		circle.setAttribute('cx', (createDots(i)*0.2*x)+50);
		circle.setAttribute('cy', (createDots(i)*0.2*y)+300);

		i++;

		animationId = requestAnimationFrame(()=>{
			bounce(path,x,y,i);
		});
	}
}


function track(){
	dot_x_pos = getDotXPos();

	if(dot_x_pos != x_pos)
		dot_y_pos = getDotYPos(dot_x_pos);

	else{

		if(y_pos > dot_y_pos){
			if(dot_y_pos + STEP > y_pos )
				dot_y_pos = y_pos;
			dot_y_pos = dot_y_pos + STEP;
		}

		if(y_pos < dot_y_pos){
			if(dot_y_pos - STEP < y_pos )
				dot_y_pos = y_pos;
			dot_y_pos = dot_y_pos - STEP;
		}

	}

	//path.setAttribute('d','M 50 0 Q ' + dot_x_pos + ' ' + dot_y_pos+' 50 600');

	circle.setAttribute('cx', dot_x_pos);
	circle.setAttribute('cy', dot_y_pos);

	animationId = requestAnimationFrame(track);
}

$('#box').mousemove((e)=>{
	x_pos = e.pageX - $(e.currentTarget).offset().left;
	y_pos = e.pageY - $(e.currentTarget).offset().top;
});

$('#box').mouseenter((e)=>{
	cancelAnimationFrame(animationId);

	animationId = requestAnimationFrame(track);
});

$('#box').mouseleave((e)=>{
	cancelAnimationFrame(animationId);

	//animationId = requestAnimationFrame(()=>{
	//	bounce(svg_path, dot_x_pos -50, dot_y_pos - 300, 0);
	//});
});
