const getServerStuff = callback => ajaxCall(json => callback(json));
const getServerStuff = callback => ajaxCall(callback);
const getServerStuff = ajaxCall;

const BlogController = {
  index(posts) {
    return Views.index(posts);
  },
  show(post) {
    return Views.show(post);
  },
  create(attrs) {
    return Db.create(attrs);
  },
  update(post, attrs) {
    return Db.update(post, attrs);
  },
  destroy(post) {
    return Db.destroy(post);
  }
};

const BlogController = {
  index: Views.index,
  show: Views.show,
  update: Db.update,
  destroy: Db.destroy
};

httpGet("/post/2", json => renderPost(json));

// in case something more than json had to be passed
// we would need to change all the httpGet calls
httpGet("/post/2", (json, err) => renderPost(json, err));

// renderPost is called from within httpGet with however many arguments it wants
httpGet("/post/2", renderPost);

// generic functions should be used as much as possible
// an example of a specific function:
const validArticles = articles =>
  articles.filter(article => article !== null && article !== undefined);

// a more generic approach
const compact = xs => xs.filter(x => x !== null && x !== undefined);
