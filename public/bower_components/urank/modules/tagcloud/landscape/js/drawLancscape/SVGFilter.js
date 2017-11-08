/**
 * @author Santokh Singh
 *
 */
function SVGFilter() {

	SVGFilter.prototype.addFilter = function() {
		var defs = svgcanvas.append("defs")
		var filter = defs.append("filter")
			.attr("id", "svgFilterOnPath")
			.attr("filterUnits", "userSpaceOnUse")
			.attr("x", "0")
			.attr("y", "0")
			.attr("width", landscapeConfig.getWidth())
			.attr("height", landscapeConfig.getHeight())

		var feGaussianBlur = filter.append("feGaussianBlur")
			.attr("in","SourceAlpha")
			.attr("stdDeviation","4")
			.attr("result","bluredPath")

		// var feOffset = filter.append("feOffset")
			// .attr("in","bluredPath")
			// .attr("dx","0.1")
			// .attr("dy", "0.1")
			// .attr("result", "bluredPathOffset")

		var feSpecularLighting = filter.append("feSpecularLighting")
			.attr("in", "bluredPath")
			.attr("surfaceScale", "3")
			.attr("specularConstant", ".60")
			.attr("specularExponent", "40")
			.attr("lighting-color", "#bbbbbb")
			.attr("result", "specOut")

		var fePointLight = feSpecularLighting.append("fePointLight")
			.attr("x", "-6000")
			.attr("y", "-10000")
			.attr("z", "20000")

		var feComposite1 = filter.append("feComposite")
			.attr("in", "specOut")
			.attr("in2", "SourceAlpha")
			.attr("operator", "in")
			.attr("result", "specOut")

		var feComposite2 = filter.append("feComposite")
			.attr("in", "SourceGraphic")
			.attr("in2", "specOut")
			.attr("operator", "arithmetic")
			.attr("k1", "0")
			.attr("k2", "1")
			.attr("k3", "1")
			.attr("k4", "0")
			.attr("result", "litPath")
//
		// var feMerge = filter.append("feMerge")
// //
		// // feMerge.append("feMergeNode")
			// // .attr("in", "bluredPathOffset")
		// feMerge.append("feMergeNode")
			// .attr("in", "litPath")

	}


}
