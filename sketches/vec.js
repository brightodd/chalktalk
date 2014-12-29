
   function Vec() {
      this.nRows = function() {
         return 1 + floor(this.selection / 2);
      }
      this.axis = function() {
         return 1 - this.selection % 2;
      }
      this.labels = 'hvec1 vvec1 hvec2 vvec2 hvec3 vvec3 hvec4 vvec4'.split(' ');
      this.value = [1,0,0,0];
      this.row = 0;
      this.precision = 1;
      this.mxy = [0,0];
      this.p10 = [1,10,100,1000];
      this.mouseDown = function(x, y) {
         this.isDraggedValue = false;
         var mt = m.transform([x,y])[this.axis()];
	 var t = this.axis() == 0 ? (1 + mt ) / 2 : (1 - mt) / 2;
         this.row = max(0, min(this.nRows()-1, floor(this.nRows() * t)));
         this.xVal = x;
         this.yVal = y;
      }
      this.mouseDrag = function(x, y) {
         var ax = abs(x - this.xVal);
         var ay = abs(y - this.yVal);
	 if (ay > 2 * ax && ay > 20) {
            var val = this.value[this.row];
	    val += (y < this.yVal ? 1 : -1) / this.p10[this.precision]
            this.isDraggedValue = true;
	    this.value[this.row] = val;
	    this.xVal = x;
	    this.yVal = y;
         }
      }
      this.mouseUp = function(x, y) { }
      this.onSwipe = function(dx, dy) {
         if (this.isDraggedValue)
	    return;
	 var s = this.selection;
         switch (pieMenuIndex(dx, dy, 8)) {
	 case 0: this.precision = min(3, this.precision + 1); break;
	 case 4: this.precision = max(0, this.precision - 1); break;
	 case 7: this.selection = s + 2; while (this.nRows() > this.value.length) this.value.push(0); break;
	 case 3: console.log(s); if (s > 1) this.selection = s - 2; break;
	 case 5: this.selection = (s & 14) + 1 - (s % 2); break;
	 }
      }

      this.render = function(elapsed) {
         var a = 1 / this.nRows();
	 switch (this.axis()) {
         case 0: mCurve([[-1,a],[1,a],[1,-a],[-1,-a],[-1,a]]); break;
         case 1: mCurve([[-a,1],[a,1],[a,-1],[-a,-1],[-a,1]]); break;
	 }
         lineWidth(1);
	 for (var i = 1 ; i < this.nRows() ; i++) {
	    var b = lerp(i / this.nRows(), 1, -1);
	    switch (this.axis()) {
            case 0: mLine([-b, a],[-b,-a]); break;
            case 1: mLine([-a, b],[ a, b]); break;
	    }
         }
         this.afterSketch(function() {
	    textHeight(m.transform([1,0,0,0])[0] / max(1.5, this.nRows() - 1) / (1.5 + this.precision));
	    var outValue = [];
            for (var i = 0 ; i < this.nRows() ; i++) {
	       var t = (i+.5) / this.nRows();
	       var a = this.axis() == 0 ? lerp(t, -1, 1) : lerp(t, 1, -1);
	       var p = this.axis() == 0 ? [a,0] : [0,a];
               var val = this.getInValue(i, this.value[i]);
	       mText(roundedString(val, this.precision), p, .5, .5);
	       outValue.push(val);
            }
            this.outValue[0] = outValue;
         });
      }
   }
   Vec.prototype = new Sketch;
   addSketchType("Vec");

