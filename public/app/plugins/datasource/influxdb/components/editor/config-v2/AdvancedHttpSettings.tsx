import { cx } from '@emotion/css';
import { useState } from 'react';

import { DataSourcePluginOptionsEditorProps } from '@grafana/data';
import {
  Box,
  InlineField,
  InlineSwitch,
  Space,
  Field,
  TagsInput,
  Input,
  CustomHeadersSettings,
  useStyles2,
} from '@grafana/ui';

import { InfluxOptions } from '../../../types';

import { getInlineLabelStyles } from './constants';

export type Props = DataSourcePluginOptionsEditorProps<InfluxOptions>;

export const AdvancedHttpSettings = ({ options, onOptionsChange }: Props) => {
  const styles = useStyles2(getInlineLabelStyles);

  const [advancedHttpSettingsIsOpen, setAdvancedHttpSettingsIsOpen] = useState(() => {
    const hasKeepCookies = 'keepCookies' in options.jsonData;
    const hasTimeout = 'timeout' in options.jsonData;
    return hasKeepCookies || hasTimeout;
  });

  return (
    <>
      <Box display="flex" alignItems="center">
        <InlineField label={<div className={cx(styles.label)}>Advanced HTTP Settings</div>} labelWidth={40}>
          <InlineSwitch
            value={advancedHttpSettingsIsOpen}
            onChange={() => setAdvancedHttpSettingsIsOpen(!advancedHttpSettingsIsOpen)}
          />
        </InlineField>
      </Box>
      {advancedHttpSettingsIsOpen && options.access === 'proxy' && (
        <>
          <Space v={2} />
          <div style={{ gap: '16px', paddingLeft: '10px' }}>
            <div style={{ width: '50%' }}>
              <Field
                label="Allowed cookies"
                description="Grafana proxy deletes forwarded cookies by default. Specify cookies by name that should
                be forwarded to the data source."
                disabled={options.readOnly}
              >
                <TagsInput
                  id="advanced-http-cookies"
                  placeholder="New cookie (hit enter to add)"
                  tags={
                    'keepCookies' in options.jsonData && Array.isArray(options.jsonData.keepCookies)
                      ? options.jsonData.keepCookies
                      : []
                  }
                  onChange={(e) => {
                    onOptionsChange({
                      ...options,
                      jsonData: {
                        ...options.jsonData,
                        ...{ keepCookies: e },
                      },
                    });
                  }}
                />
              </Field>
            </div>
            <div style={{ width: '50%' }}>
              <Field
                htmlFor="advanced-http-timeout"
                label="Timeout"
                description="HTTP request timeout in seconds."
                disabled={options.readOnly}
              >
                <Input
                  id="advanced-http-timeout"
                  type="number"
                  min={0}
                  placeholder="Timeout in seconds"
                  aria-label="Timeout in seconds"
                  value={
                    'timeout' in options.jsonData && typeof options.jsonData.timeout === 'number'
                      ? options.jsonData.timeout.toString()
                      : ''
                  }
                  onChange={(e) => {
                    const parsed = parseInt(e.currentTarget.value, 10);
                    onOptionsChange({
                      ...options,
                      jsonData: {
                        ...options.jsonData,
                        ...{ timeout: parsed },
                      },
                    });
                  }}
                />
              </Field>
            </div>
            <Space v={1} />
            {advancedHttpSettingsIsOpen && (
              <CustomHeadersSettings dataSourceConfig={options} onChange={onOptionsChange} />
            )}
          </div>
        </>
      )}
    </>
  );
};
