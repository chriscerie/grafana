import { DataSourcePluginOptionsEditorProps } from '@grafana/data';
import { InlineFieldRow, InlineField, Input, SecretInput } from '@grafana/ui';

import { InfluxOptions } from '../../../types';

export type Props = DataSourcePluginOptionsEditorProps<InfluxOptions>;

export const InfluxSQLDBConnection = ({ options, onOptionsChange }: Props) => {
  return (
    <>
      <InlineFieldRow>
        <InlineField label="Database" labelWidth={30} grow>
          <Input
            value={options.jsonData.dbName}
            onChange={(event) => {
              onOptionsChange({
                ...options,
                jsonData: {
                  ...options.jsonData,
                  dbName: event.currentTarget.value,
                },
              });
            }}
          />
        </InlineField>
      </InlineFieldRow>
      <InlineFieldRow>
        <InlineField labelWidth={30} label="Token" grow>
          <SecretInput
            isConfigured={options.secureJsonFields.token || false}
            onChange={(e) =>
              onOptionsChange({
                ...options,
                secureJsonData: {
                  ...options.secureJsonData,
                  token: e.currentTarget.value,
                },
              })
            }
            onReset={() => {
              onOptionsChange({
                ...options,
                secureJsonData: {
                  ...options.secureJsonData,
                  token: '',
                },
                secureJsonFields: {
                  ...options.secureJsonFields,
                  token: false,
                },
              });
            }}
            onBlur={() => {
              onOptionsChange({
                ...options,
                secureJsonFields: {
                  ...options.secureJsonFields,
                  token: true,
                },
              });
            }}
          />
        </InlineField>
      </InlineFieldRow>
    </>
  );
};
