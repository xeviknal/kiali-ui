import { SortField } from '../../types/SortFilters';
import { IstioConfigItem } from '../../types/IstioConfigList';
import { FILTER_ACTION_APPEND, FILTER_ACTION_UPDATE, FilterType } from '../../types/Filters';
import NamespaceFilter from '../../components/Filters/NamespaceFilter';

export namespace IstioConfigListFilters {
  export const sortFields: SortField<IstioConfigItem>[] = [
    {
      id: 'namespace',
      title: 'Namespace',
      isNumeric: false,
      param: 'ns',
      compare: (a: IstioConfigItem, b: IstioConfigItem) => {
        let sortValue = a.namespace.localeCompare(b.namespace);
        if (sortValue === 0) {
          sortValue = a.name.localeCompare(b.name);
        }
        return sortValue;
      }
    },
    {
      id: 'istiotype',
      title: 'Istio Type',
      isNumeric: false,
      param: 'it',
      compare: (a: IstioConfigItem, b: IstioConfigItem) => a.type.localeCompare(b.type)
    },
    {
      id: 'istioname',
      title: 'Istio Name',
      isNumeric: false,
      param: 'in',
      compare: (a: IstioConfigItem, b: IstioConfigItem) => a.name.localeCompare(b.name)
    },
    {
      id: 'configvalidation',
      title: 'Config',
      isNumeric: false,
      param: 'cv',
      compare: (a: IstioConfigItem, b: IstioConfigItem) => {
        let sortValue = -1;

        if (a.validation && !b.validation) {
          sortValue = -1;
        }
        if (!a.validation && b.validation) {
          sortValue = 1;
        }
        if (!a.validation && !b.validation) {
          sortValue = 0;
        }

        if (a.validation && b.validation) {
          if (a.validation.valid && !b.validation.valid) {
            sortValue = -1;
          }

          if (!a.validation.valid && b.validation.valid) {
            sortValue = 1;
          }

          if (a.validation.valid && b.validation.valid) {
            sortValue = 0;
          }

          if (!a.validation.valid && !b.validation.valid) {
            sortValue = b.validation.checks.length - a.validation.checks.length;
          }
        }

        console.log([a, a.validation, b, b.validation, sortValue]);
        return sortValue;
      }
    }
  ];

  const istioNameFilter: FilterType = {
    id: 'istioname',
    title: 'Istio Name',
    placeholder: 'Filter by Istio Name',
    filterType: 'text',
    action: FILTER_ACTION_UPDATE,
    filterValues: []
  };

  const istioTypeFilter: FilterType = {
    id: 'istiotype',
    title: 'Istio Type',
    placeholder: 'Filter by Istio Type',
    filterType: 'select',
    action: FILTER_ACTION_APPEND,
    filterValues: [
      {
        id: 'Gateway',
        title: 'Gateway'
      },
      {
        id: 'VirtualService',
        title: 'VirtualService'
      },
      {
        id: 'DestinationRule',
        title: 'DestinationRule'
      },
      {
        id: 'ServiceEntry',
        title: 'ServiceEntry'
      },
      {
        id: 'Rule',
        title: 'Rule'
      },
      {
        id: 'QuotaSpec',
        title: 'QuotaSpec'
      },
      {
        id: 'QuotaSpecBinding',
        title: 'QuotaSpecBinding'
      }
    ]
  };

  const configValidationFilter: FilterType = {
    id: 'configvalidation',
    title: 'Config',
    placeholder: 'Filter by Config Validation',
    filterType: 'select',
    action: FILTER_ACTION_APPEND,
    filterValues: [
      {
        id: 'valid',
        title: 'Valid'
      },
      {
        id: 'warning',
        title: 'Warning'
      },
      {
        id: 'notvalid',
        title: 'Not Valid'
      },
      {
        id: 'notvalidated',
        title: 'Not Validated'
      }
    ]
  };

  export const availableFilters: FilterType[] = [
    NamespaceFilter.create(),
    istioTypeFilter,
    istioNameFilter,
    configValidationFilter
  ];

  export const sortIstioItems = (
    unsorted: IstioConfigItem[],
    sortField: SortField<IstioConfigItem>,
    isAscending: boolean
  ) => {
    const sortPromise: Promise<IstioConfigItem[]> = new Promise((resolve, reject) => {
      resolve(unsorted.sort(isAscending ? sortField.compare : (a, b) => sortField.compare(b, a)));
    });

    return sortPromise;
  };
}
