import {
  RdfEntity,
  StatementSource,
  RdfBaseValue,
} from "./statement-api";

// TODO Do not load all resources.
export class FederatedSource implements StatementSource {

  private readonly sources: StatementSource [];

  protected constructor(sources: StatementSource[]) {
    this.sources = sources;
  }

  static create(sources: StatementSource[]): StatementSource {
    return new FederatedSource(sources);
  }

  async fetch(entity: RdfEntity): Promise<void> {
    for (const source of this.sources) {
      const entityCopy = RdfEntity.create(entity.id);
      await source.fetch(entityCopy);
      for (const [predicate, values] of Object.entries(entity.properties)) {
        if (entity.properties[predicate] === undefined) {
          entity.properties[predicate] = [];
        }
        addValues(entity.properties[predicate], values);
      }
    }
    return Promise.resolve(undefined);
  }

  async properties(entity: RdfEntity, predicate: string
  ): Promise<RdfBaseValue[]> {
    const result: RdfBaseValue[] = [];
    for (const source of this.sources) {
      addValues(result, await source.properties(entity, predicate));
    }
    return Promise.resolve(result);
  }

}

function addValues(values: RdfBaseValue[], newValues: RdfBaseValue[]) {
  // TODO Keep only unique.
  values.push(...newValues);
}
