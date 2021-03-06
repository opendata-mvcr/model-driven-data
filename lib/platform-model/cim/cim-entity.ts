import {
  ModelResource, LanguageString, ModelLoader,
} from "../platform-model-api";
import * as CIM from "./cim-vocabulary";
import {EntitySource} from "../../rdf/entity-source";

export class CimEntity extends ModelResource {

  static readonly TYPE: string = "cim-entity";

  cimHumanLabel?: LanguageString;

  cimHumanDescription?: LanguageString;

  cimSubClassOf: string[] = [];

  cimIsCodelist = false;

  static is(resource: ModelResource): resource is CimEntity {
    return resource.types.includes(CimEntity.TYPE);
  }

  static as(resource: ModelResource): CimEntity {
    if (CimEntity.is(resource)) {
      return resource as CimEntity;
    }
    resource.types.push(CimEntity.TYPE);
    const result =  resource as CimEntity;
    result.cimSubClassOf = result.cimSubClassOf || [];
    result.cimIsCodelist = result.cimIsCodelist || false;
    return result;
  }

}

export class CimEntityAdapter implements ModelLoader {

  canLoadResource(resource: ModelResource): boolean {
    return resource.rdfTypes.includes(CIM.CONCEPT);
  }

  async loadIntoResource(
    source: EntitySource, resource: ModelResource,
  ): Promise<string[]> {
    const cimEntity = CimEntity.as(resource);
    cimEntity.cimHumanLabel =
      await source.languageString(CIM.HAS_HUMAN_LABEL);
    cimEntity.cimHumanDescription =
      await source.languageString(CIM.HAS_HUMAN_DESCRIPTION);
    cimEntity.cimSubClassOf =
      await source.iris(CIM.HAS_SUBCLASS_OF);
    //
    cimEntity.cimIsCodelist =
      cimEntity.cimSubClassOf.includes(CIM.CODELIST_ITEM);
    return [];
  }

}
