import {RdfBaseValue, RdfEntity} from "../rdf-api";

export interface StatementSource {

  /**
   * Fetch and return all values for given predicate from this source.
   * Does NOT save the result into the entity.
   */
  properties(entity: RdfEntity, predicate: string): Promise<RdfBaseValue[]>;

  reverseProperties(
    predicate: string, entity: RdfEntity
  ): Promise<RdfBaseValue[]>;

}
