/**
 * Content Texture
 * @param params
 * @constructor
 */
function ContentTexture(params) {
    params = params || {};

    ContentObject.call(this, params);

    // public properties:
    this.source = params.source || "";
}

inheritsFrom(ContentTexture, ContentObject);