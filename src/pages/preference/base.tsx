import React from 'react';
import { GlobalStore, DvaRouterProps } from '@/common/types';
import { connect } from 'dva';
import { List, Select, Switch } from 'antd';
import {
  asyncSetLocaleToStorage,
  asyncSetEditorLiveRendering,
  asyncSetIconColor,
} from '@/actions/userPreference';
import { FormattedMessage } from 'react-intl';
import { locales } from '@/common/locales';
import { useObserver } from 'mobx-react';
import Container from 'typedi';
import { IConfigService } from '@/service/common/config';

const mapStateToProps = ({ userPreference: { locale, liveRendering, iconColor } }: GlobalStore) => {
  return {
    locale,
    liveRendering,
    iconColor,
  };
};
type PageStateProps = ReturnType<typeof mapStateToProps>;

type PageProps = PageStateProps & DvaRouterProps;

const Base: React.FC<PageProps> = props => {
  const { dispatch } = props;
  const originConfigs = [
    {
      key: 'configLanguage',
      action: (
        <Select
          key="configLanguage"
          value={props.locale}
          onChange={(e: string) => dispatch(asyncSetLocaleToStorage(e))}
          dropdownMatchSelectWidth={false}
        >
          {locales.map(o => (
            <Select.Option key={o.locale} value={o.locale}>
              {o.name}
            </Select.Option>
          ))}
        </Select>
      ),
      title: (
        <FormattedMessage id="preference.basic.configLanguage.title" defaultMessage="Language" />
      ),
      description: (
        <FormattedMessage
          id="preference.basic.configLanguage.description"
          defaultMessage="My native language is Chinese,Welcome to submit a translation on GitHub"
          values={{
            GitHub: (
              <a
                href="https://github.com/webclipper/web-clipper/tree/master/src/common/locales/data"
                target="_blank"
              >
                GitHub
              </a>
            ),
          }}
        />
      ),
    },
    {
      key: 'iconColor',
      action: (
        <Select
          key="configLanguage"
          value={props.iconColor}
          dropdownMatchSelectWidth={false}
          onChange={(e: 'dark' | 'light' | 'auto') =>
            dispatch(asyncSetIconColor.started({ value: e }))
          }
        >
          {[
            {
              name: 'Dark',
              value: 'dark',
            },
            {
              name: 'Auto',
              value: 'auto',
            },
            {
              name: 'Light',
              value: 'light',
            },
          ].map(o => (
            <Select.Option key={o.value} value={o.value}>
              {o.name}
            </Select.Option>
          ))}
        </Select>
      ),
      title: <FormattedMessage id="preference.basic.iconColor.title" defaultMessage="Icon Color" />,
      description: (
        <FormattedMessage id="preference.basic.iconColor.description" defaultMessage="Icon Color" />
      ),
    },
    {
      key: 'liveRendering',
      action: (
        <Switch
          key="liveRendering"
          checked={props.liveRendering}
          onChange={() => {
            dispatch(
              asyncSetEditorLiveRendering.started({
                value: props.liveRendering,
              })
            );
          }}
        />
      ),
      title: (
        <FormattedMessage
          id="preference.basic.liveRendering.title"
          defaultMessage="LiveRendering"
        />
      ),
      description: (
        <FormattedMessage
          id="preference.basic.liveRendering.description"
          defaultMessage="Enable LiveRendering"
        />
      ),
    },
  ];

  const configService = Container.get(IConfigService);

  const configs = useObserver(() => {
    if (configService.isLatestVersion) {
      return originConfigs;
    }
    return originConfigs.concat({
      key: 'update',
      action: (
        <a href="https://github.com/webclipper/web-clipper/releases" target="_blank">
          <FormattedMessage id="preference.basic.update.button" defaultMessage="Install Update" />
        </a>
      ),
      title: <FormattedMessage id="preference.basic.update.title" defaultMessage="Has Update" />,
      description: (
        <FormattedMessage
          id="preference.basic.update.description"
          defaultMessage="Because the review takes a week, the chrome version will fall behind."
        />
      ),
    });
  });

  return (
    <React.Fragment>
      {configs.map(({ key, action, title, description }) => (
        <List.Item key={key} actions={[action]}>
          <List.Item.Meta title={title} description={description} />
        </List.Item>
      ))}
    </React.Fragment>
  );
};

export default connect(mapStateToProps)(Base as React.FC<PageProps>) as any;
