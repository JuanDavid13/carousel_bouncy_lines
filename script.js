const requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
                            window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

const cancelAnimationFrame = window.cancelAnimationFrame || window.mozCancelAnimationFrame;

let svg_path = $('#path')[0];
let circle = $('#circle')[0];
let line = $('#line')[0];

const b = 0.1;	
const o = 0;
const w = Math.sqrt(1- Math.pow(b,2));

const DURATION =100;
const STEP = 5;

let animationId = 0;
let start;

let x_pos = 0;
let y_pos = 0;

let dot_x_pos = 0;
let dot_y_pos = 0;


function f1(x){
	return 5*Math.pow(Math.E,-b*x)
}

function createDots(x){
	return f1(x)*Math.cos(.5*w*x + o);
}


function bounce(path, x, y, i){
	if( i < DURATION){

		dot_x_pos = (createDots(i)*0.25*x)+50;
		dot_y_pos = (createDots(i)*0.3*y)+300;

		console.log(dot_x_pos);

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

function getVector(){
	let vector = [];
	vector[0] = (x_pos - dot_x_pos);
	vector[1] = (y_pos - dot_y_pos);

	return normalizeVector(vector);
}

function normalizeVector(vector){
	let v = [];
	let sqrts = Math.pow(vector[0],2) + Math.pow(vector[1],2);
	let norm = Math.sqrt(sqrts);
	
	v[0] = vector[0] / norm;
	v[1] = vector[1] / norm;
	return v;
}

function track(){

	if(x_pos != dot_x_pos || y_pos != dot_y_pos){
		let vector = getVector();

		path.setAttribute('d','M 50 0 Q ' + (50 + dot_x_pos) + ' ' + (300 - (dot_y_pos +  vector[1])) +' 50 600');

		circle.setAttribute('cx',  50 + dot_x_pos + vector[0]);
		circle.setAttribute('cy', 300 - (dot_y_pos +  vector[1]));

		line.setAttribute('x2', 50 + dot_x_pos + vector[0]);
		line.setAttribute('y2', 300 - (dot_y_pos +  vector[1]));

		if(Math.abs(dot_x_pos + vector[0] - x_pos) <= 1)
			dot_x_pos = x_pos;
		else
			dot_x_pos =  dot_x_pos + 5*vector[0];

		if(Math.abs(dot_y_pos + vector[1] - y_pos) <= 20)
			dot_y_pos = y_pos;
		else
			dot_y_pos =  dot_y_pos + 20*vector[1];
	}

	animationId = requestAnimationFrame(track);
}

$('#box').mousemove((e)=>{
	x_pos =  - 50 + (e.pageX - $(e.currentTarget).offset().left);
	y_pos = 300 - (e.pageY - $(e.currentTarget).offset().top);
});

$('#box').mouseenter((e)=>{
	cancelAnimationFrame(animationId);

	animationId = requestAnimationFrame(track);
});

$('#box').mouseleave((e)=>{
	cancelAnimationFrame(animationId);

	animationId = requestAnimationFrame(()=>{
		bounce(svg_path, dot_x_pos -50, dot_y_pos - 300, 0);
	});
});
