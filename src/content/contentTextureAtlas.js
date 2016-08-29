/**
 * Content Texture
 * @param params
 * @constructor
 */
function ContentTextureAtlas(params) {
    params = params || {};

    ContentObject.call(this, params);

    // public properties:
    this.source = params.source || null;
}

inheritsFrom(ContentTexture, ContentObject);