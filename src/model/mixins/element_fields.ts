import { Circle, Ellipse, Path, Rect, Polygon, Polyline } from "../shapes.js";
import { LengthValue, LengthXValue, LengthYValue, TextValue } from "../value.js";

declare module "../index" {
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
