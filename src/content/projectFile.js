function ProjectFile(params) {
    params = params || {};

    this.name = params.name || "New Project";
    this.settings = params.settings || {};
    this.editor = params.editor || {
            lastScene: null,
            layout: null
        };
    this.content = params.content || {};
}

ProjectFile.restore = function (data) {
    return new ProjectFile(data);
};

