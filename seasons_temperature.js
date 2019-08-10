var variable1 = 'temperature'
var interval = 2000
var maxSize = 123
  
var width = 981
var height = 508
var svg = d3.select('#Page3').append('svg')
    			.attr('width', width)
    			.attr('height', height)
    			.append('g') 

//L'ensemble des dates sur lesquelles seront récupérées les valeurs dans le json
var years1 = ['2008-été', '2009-automne', '2009-hiver',
       '2009-printemps', '2009-été', '2010-automne', '2010-hiver',
       '2010-printemps', '2010-été', '2011-automne', '2011-hiver',
       '2011-printemps', '2011-été', '2012-automne', '2012-hiver',
       '2012-printemps', '2012-été', '2013-automne', '2013-hiver',
       '2013-printemps', '2013-été', '2014-automne', '2014-hiver',
       '2014-printemps', '2014-été', '2015-automne', '2015-hiver',
       '2015-printemps', '2015-été', '2016-automne', '2016-hiver',
       '2016-printemps', '2016-été', '2017-automne', '2017-hiver',
       '2017-été']
var yearIndex1 = -1
var year1 = years1[0]    

//Définition des couleurs pour le remplissage des rectangles selon la densité de pop
var color = d3.scaleLinear().range(['#fee08b', '#d73027'])

//Définition de la projection, la map sur laquelle seront adaptées les coordonnées des territoires australiens
var projection1 = d3.geoConicConformal()
        .rotate([-132, 0])
        .center([0, -27])
        .parallels([-18, -36])
        .scale(Math.min(height * 1.2, width * 0.8))
        .translate([width / 2, height / 2])
        .precision(0.1);

//Taille des rectangles
var size1 = d3.scaleSqrt().range([0, maxSize])

//La date qui est  écrite sur la visualisation
var yearLabel1 = svg.append('text')
    .attr('class', 'year')
    .attr('x', width / 4.8)
    .attr('y', 29)
    .attr('text-anchor', 'middle')   


var mesure = 'var'  
  
//Définit la taille des links entre nodes (distance entre les rectangles)
var linkForce1 = d3.forceLink()
    .id(function (d) { return d.state })
    .distance(function (d) {
        return (
            size1(d.source[variable1].find(function (e) { return e.year === year1 })[mesure]) +
            size1(d.target[variable1].find(function (e) { return e.year === year1 })[mesure])
        ) / 1.6416
    })
    .strength(0.6)
    
//Collision entre les rectangles
var collisionForce1 = rectCollide()
    .size(function (d) {
        var l = size1(d[variable1].find(function (e) { return e.year === year1 })[mesure])
        return [l, l]
    })
    .iterations(63)

//Définition des paramètres de simulation
var simulation1 = d3.forceSimulation()
    .force('center', d3.forceCenter(width / 2.0608, (height - maxSize) / 2))
    .force('link', linkForce1)
    .force('collision', collisionForce1)
    .force('x', d3.forceX(function (d) { return d.xi }).strength(0.0125))
    .force('y', d3.forceY(function (d) { return d.yi }).strength(0.0125))

color.domain([0, 1219]);

//Si un autre item est sélectionné appel de la fonction change
d3.select("#label-option").on("change", change)

//Modifie la variable d'étude (température, humidity ou rainfall) de la fonction simulation

d3.json('data_temperature.txt', initialize)

function change() {
    if (this.selectedIndex == 0){
    simulation.stop()
    d3.json('data_temperature.txt', initialize)
    } else if (this.selectedIndex == 1){
    simulation.stop()
    d3.json('data_humidity', initialize)
    } else if (this.selectedIndex == 2){
    simulation.stop()
    d3.json('data_rainfall.txt', initialize)
    }
}

function initialize(error, data) {
    if (error) { throw error }

    var nodes = data.nodes
    var links = data.links

    size1.domain([0, d3.max(nodes, function (d) {
        return d3.max(d[variable1], function (e) { return e[mesure] })
    })])

    nodes.forEach(function (d) {
        var coords = projection1([d.lon, d.lat])
        d.x = d.xi = coords[0]
        d.y = d.yi = coords[1]
    })

    var states = svg.selectAll('.state')
        .data(nodes)
        .enter().append('g')
        .attr('class', 'state')

    states.append('rect').attr('class', 'staterect')
    states.append('text')
        .attr('text-anchor', 'middle')
        .attr('dy', '.3em')
        .text(function (d) { return d.state })
    simulation1.nodes(nodes)
    simulation1.force('link').links(links)
    simulation1.on('tick', ticked)

    update()
    d3.interval(update, interval)

    function update() {
        year1 = years1[++yearIndex1 >= years1.length ? yearIndex1 = 0 : yearIndex1]

        yearLabel1.text(year1)

        if (yearIndex1 === 0) { nodes.forEach(function (d) { d.x = d.xi; d.y = d.yi }) }

        simulation1.nodes(nodes).alpha(1).restart()
    }

    function ticked() {
        var sizes = d3.local()

        states
            .property(sizes, function (d) {
                return size1(d[variable1].find(function (e) { return e.year === year1 })[mesure])
            })
            .attr('transform', function (d) { return 'translate(' + d.x + ',' + d.y + ')' })
            

        states.selectAll('rect')
            .attr('x', function (d) { return sizes.get(this) / -2.08 })
            .attr('y', function (d) { return sizes.get(this) / -2 })
            .attr('width', function (d) { return sizes.get(this) })
            .attr('height', function (d) { return sizes.get(this) })
        		.style("fill", function(d) {
                //on prend la valeur recupere plus haut
                var value = d.population.find(function (e) { return e.year === year1 }).var;


                if (value) {
                    return color(value );
                } else { 
                    // si pas de valeur alors en gris
                    return "#ccc";
                }
            })
    }
}

  
  
function rectCollide() {
    var nodes, sizes, masses
    var size = constant([0, 0])
    var strength = 1
    var iterations = 1

    function force() {
        var node, size, mass, xi, yi
        var i = -1
        while (++i < iterations) { iterate() }

        function iterate() {
            var j = -1
            var tree = d3.quadtree(nodes, xCenter, yCenter).visitAfter(prepare)

            while (++j < nodes.length) {
                node = nodes[j]
                size = sizes[j]
                mass = masses[j]
                xi = xCenter(node)
                yi = yCenter(node)

                tree.visit(apply)
            }
        }

        function apply(quad, x0, y0, x1, y1) {
            var data = quad.data
            var xSize = (size[0] + quad.size[0]) / 2
            var ySize = (size[1] + quad.size[1]) / 2
            if (data) {
                if (data.index <= node.index) { return }

                var x = xi - xCenter(data)
                var y = yi - yCenter(data)
                var xd = Math.abs(x) - xSize
                var yd = Math.abs(y) - ySize

                if (xd < 0 && yd < 0) {
                    var l = Math.sqrt(x * x + y * y)
                    var m = masses[data.index] / (mass + masses[data.index])

                    if (Math.abs(xd) < Math.abs(yd)) {
                        node.vx -= (x *= xd / l * strength) * m
                        data.vx += x * (1 - m)
                    } else {
                        node.vy -= (y *= yd / l * strength) * m
                        data.vy += y * (1 - m)
                    }
                }
            }

            return x0 > xi + xSize || y0 > yi + ySize ||
                   x1 < xi - xSize || y1 < yi - ySize
        }

        function prepare(quad) {
            if (quad.data) {
                quad.size = sizes[quad.data.index]
            } else {
                quad.size = [0, 0]
                var i = -1
                while (++i < 4) {
                    if (quad[i] && quad[i].size) {
                        quad.size[0] = Math.max(quad.size[0], quad[i].size[0])
                        quad.size[1] = Math.max(quad.size[1], quad[i].size[1])
                    }
                }
            }
        }
    }

    function xCenter(d) { return d.x + d.vx }
    function yCenter(d) { return d.y + d.vy }

    force.initialize = function (_) {
        sizes = (nodes = _).map(size)
        masses = sizes.map(function (d) { return d[0] * d[1] })
    }

    force.size = function (_) {
        return (arguments.length
             ? (size = typeof _ === 'function' ? _ : constant(_), force)
             : size)
    }

    force.strength = function (_) {
        return (arguments.length ? (strength = +_, force) : strength)
    }

    force.iterations = function (_) {
        return (arguments.length ? (iterations = +_, force) : iterations)
    }

    return force
}

function constant(_) {
    return function () { return _ }
}
