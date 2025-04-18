import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { useNavigate } from 'react-router';

import { COLUMN_LIST } from '../../../constants/QuestionCategoryTestOnline/questionCategoryTestOnlineConstants';
import { createNotification } from '../../../helpers/Notification';
import * as questionCategoryTestOnlineActions from '../../../stores/actions/QuestionCategoryTestOnlineActions';
import { Colxx } from '../../common/CustomBootstrap';
import AddNewModal from '../../common/Data/AddNewModal';
import DataList from '../../common/Data/DataList';
import { Loader } from '../../common/Loader';
import QuestionCategoryTestOnlineCreateEdit from './QuestionCategoryTestOnlineCreateEdit';

const QuestionCategoryTestOnlineList = (props: any) => {
  const [dataTable, setDataTable] = useState(null);
  const [columns, setColumns] = useState(COLUMN_LIST);
  const [modalOpen, setModalOpen] = useState(false);

  let navigate = useNavigate();

  const [data, setData] = useState(null);
  useEffect(() => {
    props.getListAllQuestionCategoryTestOnline(props?.loginReducer?.campusId).then((listData: any) => {
      setDataTable(listData);
    });
  }, []);

  const getDataTable = async () => {
    props.getListAllQuestionCategoryTestOnline(props?.loginReducer?.campusId).then((listData: any) => {
      setDataTable(listData);
    });
  };

  const refreshDataTable = async () => {
    setDataTable(null);
    await getDataTable();
  };

  const onSubmit = async (dataForm: any) => {
    if (data === null) {
      await props.saveNewQuestionCategoryTestOnline(dataForm).then((id: any) => {
        if (id !== undefined) {
          setModalOpen(false);
          refreshDataTable();
        }
      });
    } else {
      await props.updateQuestionCategoryTestOnline(dataForm, data.id).then((id: any) => {
        if (id !== undefined) {
          setModalOpen(false);
          setData(null);
          refreshDataTable();
        }
      });
    }
  };

  const viewEditData = async (id: any) => {
    await props.dataQuestionCategoryTestOnline(id).then((formData: any) => {
      setData(formData.data);
      setModalOpen(true);
    });
  };

  const changeActiveData = async (active: any, id: any) => {
    await props.changeActiveQuestionCategoryTestOnline(active, id, true).then((formData: any) => {
      refreshDataTable();
    });
  };

  const deleteData = async (id: any) => {
    await props.deleteQuestionCategoryTestOnline(id, true).then((formData: any) => {
      refreshDataTable();
    });
  };

  const deleteAll = async (items: any) => {
    items.map(async (item: any) => {
      await props.deleteQuestionCategoryTestOnline(item.id, false).then(
        () => { },
        () => {
          createNotification('error', 'error', '');
        },
      );
    });
    refreshDataTable();
    createNotification('success', 'success', '');
  };

  const changeActiveDataAll = async (items: any) => {
    items.map(async (item: any) => {
      await props.changeActiveQuestionCategoryTestOnline(!item.active, item.id, false).then(
        () => { },
        () => {
          createNotification('error', 'error', '');
        },
      );
    });
    refreshDataTable();
    createNotification('success', 'success', '');
  };

  const additionalFunction = async (item: any, btn: any) => {
    switch (btn?.action) {
      case 'QUESTIONS':
        goToChildren(
          `/questionTestOnline`,
        );
        break;
      default:
        break;
    }
  };

  const goToChildren = async (url: string) => {
    navigate(url);
  };

  return (
    <>
      {' '}
      {dataTable !== null ? (
        <>
          <DataList
            data={dataTable}
            columns={columns}
            match={props?.match}
            modalOpen={modalOpen}
            setModalOpen={setModalOpen}
            viewEditData={viewEditData}
            deleteData={deleteData}
            changeActiveData={changeActiveData}
            deleteAll={deleteAll}
            changeActiveDataAll={changeActiveDataAll}
            additionalFunction={additionalFunction}
            childrenButtons={[
              {
                id: 0,
                label: 'Preguntas',
                color: 'info',
                icon: 'iconsminds-speach-bubble-asking',
                action: 'QUESTIONS',
              },
            ]}
            withChildren={true}
            refreshDataTable={refreshDataTable}
          />
          <QuestionCategoryTestOnlineCreateEdit
            data={data}
            modalOpen={modalOpen}
            toggleModal={() => {
              setData(null);
              return setModalOpen(!modalOpen);
            }}
            onSubmit={onSubmit}
          />
        </>
      ) : (
        <>
          <Colxx sm={12} className="d-flex justify-content-center">
            <Loader />
          </Colxx>
        </>
      )}
    </>
  );
};
const mapDispatchToProps = { ...questionCategoryTestOnlineActions };

const mapStateToProps = ({ loginReducer }: any) => {
  return { loginReducer };
};

export default connect(mapStateToProps, mapDispatchToProps)(QuestionCategoryTestOnlineList);
