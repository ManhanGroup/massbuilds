import Controller from '@ember/controller';
import content from 'calbuilds/content';

export default class extends Controller {
  constructor() {
    super();
    this.glossaryTerms = Object.values(content.GLOSSARY)
        .sort((term1, term2) =>
            term1.label.toLowerCase().localeCompare(term2.label.toLowerCase()));
  }
}
