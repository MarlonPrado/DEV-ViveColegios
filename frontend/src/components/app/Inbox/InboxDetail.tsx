import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { Loader } from '../../common/Loader';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { connect } from 'react-redux';
import { Button } from 'reactstrap';
import ProfileImg from '../../../assets/img/profiles/l-1.jpg';
import IntlMessages from '../../../helpers/IntlMessages';
import * as inboxActions from '../../../stores/actions/InboxAction';
import { Colxx } from '../../common/CustomBootstrap';
import InboxCreate from './InboxCreate';
import svgEmpty from '../../../assets/img/svg/scene-inbox-empty.svg';

const Inbox = (props: any) => {
  const [loading, setLoading] = useState(true);
  const [notifications, setInboxs] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);  

  // const methods = useFormContext();

  useEffect(() => {
    props.getListAllInbox(props?.loginReducer?.userId).then((listData: any) => {
      setInboxs(
        listData.map((c: any) => {
          return c.node;
        }),
      );
    });
    setLoading(false);
  }, []);

  const getInboxs = async () => {
    props.getListAllInbox(props?.loginReducer?.userId).then((listData: any) => {
      setInboxs(
        listData.map((c: any) => {
          return c.node;
        }),
      );
    });
  };

  const markAsRead = async (item: any) => {
    props.updateInbox({ dateRead: new Date() }, item.id).then((listData: any) => {
      getInboxs();
    });
  };

  return (
    <>
      {loading ? (
        <>
          <Colxx sm={12} className="d-flex justify-content-center">
            <Loader/>
          </Colxx>
        </>
      ) : (
        <>
          <div className="row mb-3 mr-2 d-flex justify-content-end">
          <Button
              color="primary"
              size="lg"
              className="top-right-button"
              onClick={() => {
                return setModalOpen(!modalOpen);
              }}
              disabled={true}
            >
              <IntlMessages id="pages.newMessage" />
            </Button>
          </div>        
          <div className="row">
            <div className="col-12 chat-app">
              <div className="scroll">
                <PerfectScrollbar options={{ suppressScrollX: true, wheelPropagation: false }}>
                  {notifications.length > 0 ?
                  <>
                    {notifications.map((item: any) => {
                      return (
                        <>
                          <div className="clearfix"></div>
                          <div className="card d-inline-block mb-3 float-left mr-2 w-100">
                            <div className="position-absolute pt-1 pr-2 r-0">
                              <span className="text-extra-small text-muted">
                                {moment(item?.dateSend).format('YYYY-MM-DD h:mm a')}
                              </span>
                            </div>
                            <div className="card-body">
                              <div className="d-flex flex-row">
                                <a className="d-flex" href="#">
                                  <img
                                    alt="Profile Picture"
                                    src={ProfileImg}
                                    className="img-thumbnail border-0 rounded-circle mr-3 list-thumbnail align-self-center xsmall"
                                  />
                                </a>
                                <div className=" d-flex flex-grow-1 min-width-zero">
                                  <div className="m-2 pl-0 align-self-center d-flex flex-column flex-lg-row justify-content-between min-width-zero">
                                    <div className="min-width-zero">
                                      <p
                                        className={`mb-0 truncate list-item-heading ${
                                          item.dateRead ? '' : 'font-bold'
                                        }`}
                                      >
                                        <span>
                                          {item?.user?.name} {item?.user?.lastName}
                                        </span>
                                      </p>
                                    </div>
                                    {!item.dateRead ? (
                                      <span
                                        className="ml-2 badge badge-info cursor-pointer"
                                        onClick={() => {return markAsRead(item)}}
                                      >
                                        <IntlMessages id="info.markAsRead" />
                                      </span>
                                    ) : (
                                      ''
                                    )}
                                  </div>
                                </div>
                              </div>
                              <div className="chat-text-left">
                                <p
                                  className={`mb-0 text-semi-muted ${
                                    item.dateRead ? '' : 'font-bold'
                                  }`}
                                >
                                  {item.title} : {item?.message}
                                </p>
                              </div>
                            </div>
                          </div>
                        </>
                      );
                    })}
                  </>
                  : 
                  <div className='d-flex align-items-center justify-content-center flex-column'>               
                    <img className="card-img-left w-30" src={svgEmpty} alt="Card cap" />
                    <h4 className='font-bold mt-4 mb-1'>Sin registros</h4>
                    <span className='font-bold text-muted'>No se encontraron mensajes</span>
                  </div>
                  }
                </PerfectScrollbar>
              </div>
            </div>
          </div>
          <InboxCreate
             modalOpen={modalOpen}
             getInboxs={getInboxs}
             toggleModal={() => {
               return setModalOpen(!modalOpen);
             }}
          />
        </>
      )}
    </>
  );
};

const mapDispatchToProps = { ...inboxActions };

const mapStateToProps = ({ loginReducer }: any) => {
  return { loginReducer };
};

export default connect(mapStateToProps, mapDispatchToProps)(Inbox);
