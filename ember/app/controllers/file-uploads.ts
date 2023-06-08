import Controller from '@ember/controller';


export default class FileUploads extends Controller.extend({
  // anything which *must* be merged to prototype here
  actions: {
    uploadFile(file) {
      console.log(file);
    }
  }
}) {
  // normal class body definition here

}

// DO NOT DELETE: this is how TypeScript knows how to look up your controllers.
declare module '@ember/controller' {
  interface Registry {
    'file-uploads': FileUploads;
  }
}
