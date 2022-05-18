import { JSONSchema7 } from 'json-schema';

import { ISubFormatter } from './base';

import { TransformerError } from '../../error';
import { BaseEntity } from '../entity/base';

export class ChainFormatter implements ISubFormatter {
  private formatters: ISubFormatter[] = [];

  public addFormatter(formatter: ISubFormatter): this {
    this.formatters.push(formatter);
    return this;
  }

  public support(entity: BaseEntity): boolean {
    return this.formatters.some((formatter) => formatter.support(entity));
  }

  public getDefinition(entity: BaseEntity): JSONSchema7 {
    return this.getSupportFormatter(entity).getDefinition(entity);
  }

  public getChildren(entity: BaseEntity): BaseEntity[] {
    return this.getSupportFormatter(entity).getChildren(entity);
  }

  private getSupportFormatter(entity: BaseEntity): ISubFormatter {
    const supportedFormatter = this.formatters.find((formatter) => formatter.support(entity));

    if (!supportedFormatter) {
      throw new TransformerError(`Not find supported formatter, it's an unexpected error, please contact maintainers.`);
    }

    return supportedFormatter;
  }
}
