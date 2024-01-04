// * eslint-disable react-hooks/exhaustive-deps */
// /* eslint-disable no-loop-func */
import { useEffect, useState } from 'react';
import Dashboard from '../components/Dashboard';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
// PrimeReact
import { MultiSelect } from 'primereact/multiselect';
// MUI
import { Button, Dialog, DialogContent, DialogTitle } from '@mui/material';
import Snackbar from '../components/Snackbar';

// --------------------------------------------------------------------

export default function InformationEdit({ data }) {
  const [applicationName, setApplicationName] = useState('');
  const [applicationAcronym, setApplicationAcronym] = useState('');
  const [applicationLifeCycle, setApplicationLifeCycle] = useState('');
  const [applicationDescription, setApplicationDescription] = useState('');
  const [businessSkillTeam, setBusinessSkillTeam] = useState('');
  const [workStream, setWorkStream] = useState('');
  const [keyProcess, setKeyProcess] = useState('');
  const [applySla, setApplySla] = useState('');
  const [soxClassification, setSoxClassification] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [decommisionDate1, setDecommisionDate] = useState('');
  const [bmitApplication, setBmitApplication] = useState('');
  const [architectCDSID, setArchitectCDSID] = useState('');
  const [architectName, setArchitectName] = useState('');
  const [applicationOwner, setApplicationOwner] = useState('');
  const [applicationOwnerName, setApplicationOwnerName] = useState('');
  const [applicationDelegateName, setApplicationDelegateName] = useState('');
  const [applicationDeligateCDSID, setApplicationDelegateCDSID] = useState('');
  const [primaryDelegateCDSID, setPrimaryDelegateCDSID] = useState('');
  const [primaryDelegateName, setPrimaryDelegateName] = useState('');
  const [backupDelegateCDSID, setBackupDelegateCDSID] = useState('');
  const [backupDelegateName, setBackupDelegateName] = useState('');
  const [businessAppDataOwnerCDSID, setBusinessAppDataOwnerCDSID] =
    useState('');
  const [businessAppDataOwner, setBusinessAppDataOwner] = useState('');
  const [inbound, setInbound] = useState('');
  const [outbound, setOutbound] = useState('');
  const [token, setToken] = useState('');
  const params = useParams();
  const navigate = useNavigate();
  const [id, setId] = useState('');
  const [techNames, setTechNames] = useState([]);
  // DropDowns
  const [lifeCycleOptions, setLifeCycleOptions] = useState([]);
  const [skillOptions, setSkillOptions] = useState([]);
  const [workStreamOptions, setWorkStreamOptions] = useState([]);
  const [keyProcessOptions, setKeyProcessOptions] = useState([]);
  const [slaOptions, setSlaOptions] = useState([]);
  const [soxOptions, setSoxOptions] = useState([]);
  const [bmitOptions, setBmitOptions] = useState([]);

  const [techOptions, setTechOptions] = useState([]);
  const [extractedArray, setExtractedArray] = useState([]);
  const [techIdString, setTechIdString] = useState('');

  // Snackbar
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarType, setSnackbarType] = useState('success');

  const [monitor, setMonitor] = useState(false);
  // Dialog
  const [apiData, setApiData] = useState();
  const [openDialog, setOpenDialog] = useState(false);
  const [newConstData, setNewConstData] = useState();
  const [newInboundData, setNewInboundData] = useState('');
  const [newOutboundData, setNewOutboundData] = useState('');
  // ---------------------

  const func = () => {
    console.log('hhhhhhh', extractedArray);
    console.log(
      'Patterned',
      extractedArray.map((x, i) => {
        return {
          technologyName: x.technologyName,
          techMapId: x.techMapId,
          newId: x.id,
        };
      })
    );
    /////////////////
    const data = Object.values(techNames).map((x, i) => x);
    console.log(
      'Filterrrrrrrrrr',
      data.filter(val => {
        return val == extractedArray[1].technologyName;
      })
    );

    console.log(
      'Looping',
      extractedArray.forEach((x, i) => {
        data.filter(val => {
          return val == x.technologyName;
        });
      })
    );
  };

  const initialHeader = [
    'SourceAppName',
    'HostName',
    'Connectivity',
    'Authantication',
    'Internal',
  ];
  const initialHeaderOutbound = [
    'DestiAppName',
    'HostName',
    'Connectivity',
    'Authentication',
    'External',
  ];
  const [inboundData, setInboundData] = useState([
    initialHeader,
    ['', '', '', '', ''],
  ]);
  const [outboundData, setOutboundData] = useState([
    initialHeaderOutbound,
    ['', '', '', '', ''],
  ]);
  // const [dataToDisplay, setDataToDisplay] = useState(null);

  const addRow = tableType => {
    if (tableType === 'inbound') {
      setInboundData([...inboundData, ['', '', '', '', '']]);
    } else if (tableType === 'outbound') {
      setOutboundData([...outboundData, ['', '', '', '', '']]);
    }
  };

  const deleteRow = (tableType, rowIndex) => {
    if (tableType === 'inbound') {
      const updatedInboundData = [...inboundData];
      updatedInboundData.splice(rowIndex + 1, 1); // Offset by 1 for data rows
      setInboundData(updatedInboundData);
    } else if (tableType === 'outbound') {
      const updatedOutboundData = [...outboundData];
      updatedOutboundData.splice(rowIndex + 1, 1); // Offset by 1 for data rows
      setOutboundData(updatedOutboundData);
    }
  };

  const updateCellValue = (tableType, rowIndex, colIndex, newValue) => {
    if (tableType === 'inbound') {
      const updatedInboundData = [...inboundData];
      updatedInboundData[rowIndex + 1][colIndex] = newValue; // Offset by 1 for data rows
      setInboundData(updatedInboundData);
    } else if (tableType === 'outbound') {
      const updatedOutboundData = [...outboundData];
      updatedOutboundData[rowIndex + 1][colIndex] = newValue; // Offset by 1 for data rows
      setOutboundData(updatedOutboundData);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('accessToken');

    axios
      .get(
        'https://secure.focusrtech.com:5050/ApplicationManager/api/TechnologyCreate/Service/getAllTechnologyNameLOV',
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + token,
          },
        }
      )
      .then(res => {
        setTechOptions(res.data);
      })
      .catch(err => {
        console.log('Error in MultiSelect Options', err);
      });
  }, []);

  const handleApplicationNameChange = event => {
    console.log('event.target.value', event.target.value);
    setApplicationName(event.target.value);
  };

  const handleAcronymChange = event => {
    setApplicationAcronym(event.target.value);
  };

  const handleLifeCycleChange = event => {
    setApplicationLifeCycle(event.target.value);
  };

  const handleDescriptionChange = event => {
    setApplicationDescription(event.target.value);
  };

  const handleSkillTeamChange = event => {
    setBusinessSkillTeam(event.target.value);
  };

  useEffect(() => {
    setTechNames('');
    const token = localStorage.getItem('accessToken');
    axios
      .get(
        'https://secure.focusrtech.com:5050/ApplicationManager/api/ApplicationInfo/Service/getAllAppInfo',
        {
          headers: {
            'Content-Type': 'application/json',
            // eslint-disable-next-line prefer-template
            Authorization: `Bearer ` + token,
          },
        }
      )
      .then(response => {
        console.log('This Is Response Data', response.data);
        console.log('This Is Params Id', params);

        const newArr = response.data.filter(val => {
          return val.id == params.id;
        });

        const { techMap } = newArr[0];
        console.log('techMap', techMap);

        console.log('This Is NewArr', newArr);

        setApplicationName(newArr[0].applicationName);
        setApplicationAcronym(newArr[0].applicationAcronym);
        setApplicationLifeCycle(newArr[0].applicationLifecycle);
        setApplicationDescription(newArr[0].applicationDescription);
        setBusinessSkillTeam(newArr[0].businessSkillTeam);
        setWorkStream(newArr[0].workStream);
        setKeyProcess(newArr[0].keyProcess);
        setApplySla(newArr[0].applySLA);
        setSoxClassification(newArr[0].sOxClassification);
        setSelectedDate(newArr[0].productionLunchDate);
        setDecommisionDate(newArr[0].decommisionDate);
        setBmitApplication(newArr[0].bmitApplication);
        setArchitectCDSID(newArr[0].architechCDSID);
        setArchitectName(newArr[0].architechName);
        setApplicationOwner(newArr[0].applicationOwner);
        setApplicationOwnerName(newArr[0].applicationOwnerName);
        setApplicationDelegateCDSID(newArr[0].applicationDeligateCDSID);
        setApplicationDelegateName(newArr[0].applicationDeligateNmae);
        setPrimaryDelegateCDSID(newArr[0].primaryDelegateCdsid);
        setPrimaryDelegateName(newArr[0].primaryDelegateName);
        setBackupDelegateCDSID(newArr[0].backupDelegateCDSID);
        setBusinessAppDataOwnerCDSID(newArr[0].businessAppDataOwnerCDSID);
        setBusinessAppDataOwner(newArr[0].businessAppDataOwner);
        setBackupDelegateCDSID(newArr[0].backupDelegateCdsid);
        setBackupDelegateName(newArr[0].backupDelegateName);

        setId(newArr[0].id);
        console.log('inbound map', newArr[0].inboundMap);

        setInbound(newArr[0].inboundMap);
        setNewInboundData(newArr[0].inboundMap);
        console.log('inbound', newArr[0].inboundMap);
        setNewOutboundData(newArr[0].outboundMap);
        console.log('outbound', newArr[0].outboundMap);
        setOutbound(newArr[0].outboundMap.map((a, b) => a.outbound));
        console.log('outBound', newArr[0].outboundMap);
        setTechNames(newArr[0].techMap.map((x, i) => x.technologyName));
        console.log('techNames', techNames);
        setNewConstData(newArr[0].techMap);
        console.log(
          'Nithiu',
          newArr[0].techMap.map((x, i) => {
            return {
              technologyName: x.technologyName,
              techMapId: x.techMapId,
            };
          })
        );
        setExtractedArray(newArr[0].techMap);
        console.log('Extra', extractedArray);

        console.log(techNames);
        const a = localStorage.getItem('email');
        if (
          newArr[0].applicationOwner == localStorage.getItem('email') ||
          newArr[0].backupDelegateCdsid == localStorage.getItem('email') ||
          newArr[0].primaryDelegateCdsid == localStorage.getItem('email')
        ) {
          setMonitor(false);
        } else {
          console.log('aaaaaa', a);
          console.log('dddddddddddd', newArr[0].primaryDelegateCdsid);
          console.log('applicationOwner =>', applicationOwner);
          console.log('backupDelegateCDSID =>', backupDelegateCDSID);
          console.log('primaryDelegateCDSID =>', primaryDelegateCDSID);
          setMonitor(true);
        }
      });

    //Object.values(techNames)
  }, []);

  const updateData = () => {
    const [...multi] = techNames;
    console.log(
      'qwerty',
      multi.map((x, i) => {
        return {
          technologyName: x,
        };
      })
    );
    const localTemp = multi.map((x, i) => {
      return {
        technologyName: x,
      };
    });

    axios
      .post(
        'https://secure.focusrtech.com:5050/ApplicationManager/api/ApplicationInfo/Service/createApplicationInfo',
        {
          id: id,

          applicationName: applicationName,
          applicationAcronym: applicationAcronym,
          applicationLifecycle: applicationLifeCycle,
          applicationDescription: applicationDescription,
          businessSkillTeam: businessSkillTeam,
          workStream: workStream,
          keyProcess: keyProcess,
          applySLA: applySla,
          sOxClassification: soxClassification,
          productionLunchDate: selectedDate,
          decommisionDate: decommisionDate1,
          bmitApplication: bmitApplication,
          architechCDSID: architectCDSID,
          architechName: architectName,
          applicationOwner: applicationOwner,
          applicationOwnerName: applicationOwnerName,
          applicationDeligateCDSID: applicationDeligateCDSID,
          applicationDeligateNmae: applicationDelegateName,
          primaryDelegateCdsid: primaryDelegateCDSID,
          primaryDelegateName: primaryDelegateName,
          backupDelegateName: backupDelegateName,
          backupDelegateCdsid: backupDelegateCDSID,
          businessAppDataOwnerCDSID: businessAppDataOwnerCDSID,
          businessAppDataOwner: businessAppDataOwner,
          inboundMap: newInboundData,
          outboundMap: newOutboundData,
          techMap: localTemp,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ` + token,
          },
        }
      )
      .then(response => {
        console.log('Updated Successfully', response.status);
        handleSnackbar('Application Updated SuccessFully', 'success');
      })
      .catch(error => {
        console.log('Error Acquired', error);
        handleSnackbar('An Error Occured', 'error');
      });
    navigate('/application');
  };

  const opendialogApi = prop => {
    console.log('PROP', prop);
    //setApiData()
    const token = localStorage.getItem('accessToken');
    axios
      .get(
        'https://secure.focusrtech.com:5050/ApplicationManager/api/TechnologyCreate/Service/getAllTechDetails',
        {
          headers: {
            'Content-Type': 'application/json',
            // eslint-disable-next-line prefer-template
            Authorization: `Bearer ` + token,
          },
        }
      )
      .then(res => {
        console.log(res);
        const newArray = res.data.filter(value => {
          return value.nameVersion == prop;
        });
        setApiData(
          res.data.filter(value => {
            return value.nameVersion == prop;
          })
        );
        setApiData(newArray);

        console.log('NEwArray', newArray);
        setOpenDialog(true);
      })
      .catch(err => {
        console.error(err);
      });
  };

  const handleSnackbar = (message, type) => {
    setSnackbarMessage(message);
    setSnackbarType(type);
    setShowSnackbar(true);
    setTimeout(() => setShowSnackbar(false), 3000); // Hide snackbar after 3 seconds
  };

  // MultiSelect Change
  const handleInputChangeMultiple = (e, id) => {
    // Make a copy of the current input state
    const updateValue = [...setTechNames];

    // Find the select of the value that corresponds to the changed input
    const selectValue = updateValue.findIndex(
      select => select.techMapId === id
    );

    // Update the value of the value with the new input value
    updateValue[selectValue].technologyName = e.target.value;

    // Update the state with the modified values
    setTechNames(updateValue);
  };

  // Table onChange Inbound
  const handleInputChange = (e, id) => {
    // Make a copy of the current rows state
    const updatedRows = [...newInboundData];

    // Find the index of the row that corresponds to the changed input
    const rowIndex = updatedRows.findIndex(row => row.inboundMapId === id);

    // Update the value of the row with the new input value
    updatedRows[rowIndex].sourceAppName = e.target.value;

    // Update the state with the modified rows
    setNewInboundData(updatedRows);
  };

  const handleInputChangeHostName = (e, id) => {
    // Make a copy of the current rows state
    const updatedRows = [...newInboundData];

    // Find the index of the row that corresponds to the changed input
    const rowIndex = updatedRows.findIndex(row => row.inboundMapId === id);

    // Update the value of the row with the new input value
    updatedRows[rowIndex].hostName = e.target.value;

    // Update the state with the modified rows
    setNewInboundData(updatedRows);
  };

  return (
    <>
      <div className="sticky top-0">
        <Dashboard />
      </div>
      <div className="flex flex-col md:flex-row">
        <div className="w-full md:w-1/2 h-screen p-4 border-r-4">
          <h1 className="text-3xl font-bold text-left">
            Application Information
          </h1>
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="application name"
                className="block text-sm font-medium text-gray-700"
              >
                <span className="after:content-['*'] after:ml-0.5  after:text-red-500 block text-sm font-medium text-slate-700">
                  Application Name
                </span>
              </label>
              <input
                type="text"
                name="application Name"
                id="application Name"
                autoComplete="off"
                value={applicationName}
                disabled={monitor}
                onChange={handleApplicationNameChange}
                maxLength={244}
                className="w-full border rounded p-2"
              />
            </div>
            <div>
              <label
                htmlFor="application acronym"
                className="block text-sm font-medium text-gray-700"
              >
                <span className="after:content-['*'] after:ml-0.5  after:text-red-500 block text-sm font-medium text-slate-700">
                  Application Acronym
                </span>
              </label>
              <input
                type="text"
                name="application acronym"
                id="application acronym"
                value={applicationAcronym}
                onChange={handleAcronymChange}
                disabled={monitor}
                maxLength={10}
                autoComplete="off"
                className="w-full border rounded p-2"
              />
            </div>
            <div>
              <label
                htmlFor="application life cycle state"
                className="block text-sm font-medium text-gray-700"
              >
                Application Life cycle State
              </label>
              <select
                id="application life cycle state"
                name="application life cycle state"
                value={applicationLifeCycle}
                onChange={handleLifeCycleChange}
                disabled={monitor}
                className="w-full border rounded p-2"
              >
                <option value="">None</option>
                {lifeCycleOptions.map(x => (
                  <option key={x.id} value={x.applicationLifecycle}>
                    {x.applicationLifecycle}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label
                htmlFor="application Description"
                className="block text-sm font-medium text-gray-700"
              >
                Application Description
              </label>
              <textarea
                id="application Description"
                name="application Description"
                rows={4}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                value={applicationDescription}
                onChange={handleDescriptionChange}
                disabled={monitor}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Three input fields below the split screen */}
      <div className="w-full p-4 bg-gray-100">
        <h2 className="text-2xl font-bold text-left">Data & Technology</h2>
        <div className="mt-4 grid grid-cols-1 gap-4">
          <div className="mb-4">
            <h2 className="text-xl mb-2">Inbound Data</h2>
            <div className="overflow-x-auto">
              <table className="table-auto min-w-max">
                <thead>
                  <tr>
                    <th className="border px-4 py-2">SourceAppName</th>
                    <th className="border px-4 py-2">HostName</th>
                    <th className="border px-4 py-2">Connectivity</th>
                    <th className="border px-4 py-2">Authentication</th>
                    <th className="border px-4 py-2">Internal</th>
                    {/* <th className="border px-4 py-2">Actions</th> */}
                  </tr>
                </thead>
                <tbody>
                  {!!newInboundData
                    ? newInboundData.map((x, i) => {
                        return (
                          <tr key={i}>
                            <td>
                              <input
                                value={x.sourceAppName}
                                disabled={monitor}
                                onChange={e =>
                                  handleInputChange(e, x.inboundMapId)
                                }
                              />
                            </td>
                            <td>
                              <input
                                value={x.hostName}
                                disabled={monitor}
                                onChange={e =>
                                  handleInputChangeHostName(e, x.inboundMapId)
                                }
                              />{' '}
                            </td>
                            <td>
                              <input
                                value={x.connectivity}
                                disabled={monitor}
                                onChange={e =>
                                  handleInputChangeConnectivity(
                                    e,
                                    x.inboundMapId
                                  )
                                }
                              />
                            </td>
                            <td>
                              <input
                                value={x.authantication}
                                disabled={monitor}
                                onChange={e =>
                                  handleInputChangeAuthentication(
                                    e,
                                    x.inboundMapId
                                  )
                                }
                              />
                            </td>
                            <td>
                              <select
                                value={x.internal}
                                disabled={monitor}
                                onChange={e =>
                                  handleInputChangeInternal(e, x.inboundMapId)
                                }
                              >
                                <option value=""></option>
                                <option value="External">External</option>
                                <option value="Internal">Internal</option>
                              </select>
                            </td>
                          </tr>
                        );
                      })
                    : null}
                </tbody>
              </table>
            </div>
          </div>

          {/* Outbound Table */}
          <div>
            <h2 className="text-xl mb-2">Outbound Data</h2>
            <div className="overflow-x-auto">
              <table className="table-auto min-w-max">
                <thead>
                  <tr>
                    <th className="border px-4 py-2">DestiAppName</th>
                    <th className="border px-4 py-2">HostName</th>
                    <th className="border px-4 py-2">Connectivity</th>
                    <th className="border px-4 py-2">Authentication</th>
                    <th className="border px-4 py-2">External</th>
                  </tr>
                </thead>
                <tbody>
                  {!!newOutboundData
                    ? newOutboundData.map((x, i) => {
                        return (
                          <tr key={i}>
                            <td>
                              <input
                                value={x.destiAppName}
                                disabled={monitor}
                                onChange={e =>
                                  handleInputChangeoutbound(e, x.outboundMapId)
                                }
                              />
                            </td>
                            <td>
                              <input
                                value={x.hostName}
                                disabled={monitor}
                                onChange={e =>
                                  handleInputChangeHostNameoutbound(
                                    e,
                                    x.outboundMapId
                                  )
                                }
                              />
                            </td>
                            <td>
                              <input
                                value={x.connectivity}
                                disabled={monitor}
                                onChange={e =>
                                  handleInputChangeConnectivityoutbound(
                                    e,
                                    x.outboundMapId
                                  )
                                }
                              />
                            </td>
                            <td>
                              <input
                                value={x.authentication}
                                disabled={monitor}
                                onChange={e =>
                                  handleInputChangeAuthenticationOutbound(
                                    e,
                                    x.outboundMapId
                                  )
                                }
                              />
                            </td>
                            <td>
                              <select
                                value={x.external}
                                disabled={monitor}
                                onChange={e =>
                                  handleInputChangeExternal(e, x.outboundMapId)
                                }
                              >
                                <option value=""></option>
                                <option value="External">External</option>
                                <option value="Internal">Internal</option>
                              </select>
                            </td>
                          </tr>
                        );
                      })
                    : null}

                  <td className="border px-4 py-2"></td>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div>
          <label
            htmlFor="technology"
            className="block text-sm font-medium text-gray-700"
          >
            Technology
          </label>
          <div className="flex items-center">
            <MultiSelect
              value={techNames}
              onChange={e => setTechNames(e.target.value)}
              options={techOptions}
              disabled={monitor}
              optionLabel="name_VERSION"
              optionValue="name_VERSION"
              filter
              className="w-full border rounded pb-[-1]"
            />
          </div>
          {Object.values(techNames).map((x, i) => {
            return (
              <Button onClick={() => opendialogApi(x)} key={i}>
                {x}
              </Button>
            );
          })}
        </div>
      </div>
      <div className="mt-4 text-center">
        <button
          type="submit"
          onClick={updateData}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Submit
        </button>
      </div>
    </>
  );
}
