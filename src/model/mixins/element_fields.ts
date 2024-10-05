import { ViewBox } from "../valuesets.js";
import { LengthValue, LengthXValue, LengthYValue, TextValue } from "../value.js";
import { Circle, Ellipse, Path, Rect, Polygon, Polyline, Line } from "../shapes.js";
import { Symbol, Marker } from "../containers.js";
import { Use } from "../elements.js";


declare module "../index" {
    interface Use {
        get width(): LengthXValue;
        get height(): LengthYValue;
        get x(): LengthXValue;
        get y(): LengthYValue;
        get href(): TextValue;
    }
    interface Symbol {
        get width(): LengthXValue;
        get height(): LengthYValue;
        get x(): LengthXValue;
        get y(): LengthYValue;
        get ref_x(): LengthXValue;
        get ref_y(): LengthYValue;
        get view_box(): ViewBox;
    }
    interface Marker {
        get ref_x(): LengthXValue;
        get ref_y(): LengthYValue;
        get view_box(): ViewBox;
        get marker_units(): TextValue;
        get marker_width(): LengthXValue;
        get marker_height(): LengthYValue;
        get orient(): LengthValue;
    }
    interface Path {
        get marker_start(): TextValue;
        get marker_mid(): TextValue;
        get marker_end(): TextValue;
        get d(): TextValue;
    }
    interface Ellipse {
        get rx(): LengthXValue;
        get ry(): LengthYValue;
        get cx(): LengthXValue;
        get cy(): LengthYValue;
    }
    interface Circle {
        get cx(): LengthXValue;
        get cy(): LengthYValue;
        get r(): LengthValue;
    }
    interface Rect {
        get rx(): LengthXValue;
        get ry(): LengthYValue;
        get width(): LengthXValue;
        get height(): LengthYValue;
        get x(): LengthXValue;
        get y(): LengthYValue;
    }
    interface Line {
        get marker_start(): TextValue;
        get marker_mid(): TextValue;
        get marker_end(): TextValue;
        get x1(): LengthXValue;
        get y1(): LengthYValue;
        get x2(): LengthXValue;
        get y2(): LengthYValue;
    }
    interface Polygon {
        get marker_start(): TextValue;
        get marker_mid(): TextValue;
        get marker_end(): TextValue;
    }
    interface Polyline {
        get marker_start(): TextValue;
        get marker_mid(): TextValue;
        get marker_end(): TextValue;
    }
}

Object.defineProperty(Use.prototype, "width", {
    get: function () {
        return this._new_field("width", new LengthXValue(100));
    },
});
Object.defineProperty(Use.prototype, "height", {
    get: function () {
        return this._new_field("height", new LengthYValue(100));
    },
});
Object.defineProperty(Use.prototype, "x", {
    get: function () {
        return this._new_field("x", new LengthXValue(0));
    },
});
Object.defineProperty(Use.prototype, "y", {
    get: function () {
        return this._new_field("y", new LengthYValue(0));
    },
});
Object.defineProperty(Use.prototype, "href", {
    get: function () {
        return this._new_field("href", new TextValue(''));
    },
});
Object.defineProperty(Symbol.prototype, "width", {
    get: function () {
        return this._new_field("width", new LengthXValue(100));
    },
});
Object.defineProperty(Symbol.prototype, "height", {
    get: function () {
        return this._new_field("height", new LengthYValue(100));
    },
});
Object.defineProperty(Symbol.prototype, "x", {
    get: function () {
        return this._new_field("x", new LengthXValue(0));
    },
});
Object.defineProperty(Symbol.prototype, "y", {
    get: function () {
        return this._new_field("y", new LengthYValue(0));
    },
});
Object.defineProperty(Symbol.prototype, "ref_x", {
    get: function () {
        return this._new_field("ref_x", new LengthXValue(0));
    },
});
Object.defineProperty(Symbol.prototype, "ref_y", {
    get: function () {
        return this._new_field("ref_y", new LengthYValue(0));
    },
});
Object.defineProperty(Symbol.prototype, "view_box", {
    get: function () {
        return this._new_field("view_box", new ViewBox([0, 0], [100, 100]));
    },
});
Object.defineProperty(Marker.prototype, "ref_x", {
    get: function () {
        return this._new_field("ref_x", new LengthXValue(0));
    },
});
Object.defineProperty(Marker.prototype, "ref_y", {
    get: function () {
        return this._new_field("ref_y", new LengthYValue(0));
    },
});
Object.defineProperty(Marker.prototype, "view_box", {
    get: function () {
        return this._new_field("view_box", new ViewBox([0, 0], [100, 100]));
    },
});
Object.defineProperty(Marker.prototype, "marker_units", {
    get: function () {
        return this._new_field("marker_units", new TextValue('strokeWidth'));
    },
});
Object.defineProperty(Marker.prototype, "marker_width", {
    get: function () {
        return this._new_field("marker_width", new LengthXValue(3));
    },
});
Object.defineProperty(Marker.prototype, "marker_height", {
    get: function () {
        return this._new_field("marker_height", new LengthYValue(3));
    },
});
Object.defineProperty(Marker.prototype, "orient", {
    get: function () {
        return this._new_field("orient", new LengthValue(0));
    },
});
Object.defineProperty(Path.prototype, "marker_start", {
    get: function () {
        return this._new_field("marker_start", new TextValue('none'));
    },
});
Object.defineProperty(Path.prototype, "marker_mid", {
    get: function () {
        return this._new_field("marker_mid", new TextValue('none'));
    },
});
Object.defineProperty(Path.prototype, "marker_end", {
    get: function () {
        return this._new_field("marker_end", new TextValue('none'));
    },
});
Object.defineProperty(Path.prototype, "d", {
    get: function () {
        return this._new_field("d", new TextValue(''));
    },
});
Object.defineProperty(Ellipse.prototype, "rx", {
    get: function () {
        return this._new_field("rx", new LengthXValue(0));
    },
});
Object.defineProperty(Ellipse.prototype, "ry", {
    get: function () {
        return this._new_field("ry", new LengthYValue(0));
    },
});
Object.defineProperty(Ellipse.prototype, "cx", {
    get: function () {
        return this._new_field("cx", new LengthXValue(0));
    },
});
Object.defineProperty(Ellipse.prototype, "cy", {
    get: function () {
        return this._new_field("cy", new LengthYValue(0));
    },
});
Object.defineProperty(Circle.prototype, "cx", {
    get: function () {
        return this._new_field("cx", new LengthXValue(0));
    },
});
Object.defineProperty(Circle.prototype, "cy", {
    get: function () {
        return this._new_field("cy", new LengthYValue(0));
    },
});
Object.defineProperty(Circle.prototype, "r", {
    get: function () {
        return this._new_field("r", new LengthValue(0));
    },
});
Object.defineProperty(Rect.prototype, "rx", {
    get: function () {
        return this._new_field("rx", new LengthXValue(0));
    },
});
Object.defineProperty(Rect.prototype, "ry", {
    get: function () {
        return this._new_field("ry", new LengthYValue(0));
    },
});
Object.defineProperty(Rect.prototype, "width", {
    get: function () {
        return this._new_field("width", new LengthXValue(100));
    },
});
Object.defineProperty(Rect.prototype, "height", {
    get: function () {
        return this._new_field("height", new LengthYValue(100));
    },
});
Object.defineProperty(Rect.prototype, "x", {
    get: function () {
        return this._new_field("x", new LengthXValue(0));
    },
});
Object.defineProperty(Rect.prototype, "y", {
    get: function () {
        return this._new_field("y", new LengthYValue(0));
    },
});
Object.defineProperty(Line.prototype, "marker_start", {
    get: function () {
        return this._new_field("marker_start", new TextValue('none'));
    },
});
Object.defineProperty(Line.prototype, "marker_mid", {
    get: function () {
        return this._new_field("marker_mid", new TextValue('none'));
    },
});
Object.defineProperty(Line.prototype, "marker_end", {
    get: function () {
        return this._new_field("marker_end", new TextValue('none'));
    },
});
Object.defineProperty(Line.prototype, "x1", {
    get: function () {
        return this._new_field("x1", new LengthXValue(0));
    },
});
Object.defineProperty(Line.prototype, "y1", {
    get: function () {
        return this._new_field("y1", new LengthYValue(0));
    },
});
Object.defineProperty(Line.prototype, "x2", {
    get: function () {
        return this._new_field("x2", new LengthXValue(0));
    },
});
Object.defineProperty(Line.prototype, "y2", {
    get: function () {
        return this._new_field("y2", new LengthYValue(0));
    },
});
Object.defineProperty(Polygon.prototype, "marker_start", {
    get: function () {
        return this._new_field("marker_start", new TextValue('none'));
    },
});
Object.defineProperty(Polygon.prototype, "marker_mid", {
    get: function () {
        return this._new_field("marker_mid", new TextValue('none'));
    },
});
Object.defineProperty(Polygon.prototype, "marker_end", {
    get: function () {
        return this._new_field("marker_end", new TextValue('none'));
    },
});
Object.defineProperty(Polyline.prototype, "marker_start", {
    get: function () {
        return this._new_field("marker_start", new TextValue('none'));
    },
});
Object.defineProperty(Polyline.prototype, "marker_mid", {
    get: function () {
        return this._new_field("marker_mid", new TextValue('none'));
    },
});
Object.defineProperty(Polyline.prototype, "marker_end", {
    get: function () {
        return this._new_field("marker_end", new TextValue('none'));
    },
});
