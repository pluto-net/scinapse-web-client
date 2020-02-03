import React, { FC, useState, useEffect, useMemo } from 'react';
import { Formik, Form } from 'formik';
import { SuggestAffiliation } from '../../api/suggest';
import { Affiliation } from '../../model/affiliation';
import { useSelector } from 'react-redux';
import { AppState } from '../../reducers';
import { CurrentUser } from '../../model/currentUser';
import { withStyles } from '../../helpers/withStylesHelper';
import { Button } from '@pluto_network/pluto-design-elements';
import { ProfileRegisterParams } from '../profileRegister';
import AffiliationAPI, { TokenVerificationRes } from '../../api/affiliation';
import profileAPI from '../../api/profile';
import EmailPasswordFields from './emailPasswordFields';
import NameInputFields from './nameInputFields';
import AffiliationInputField from './affiliationField';
import GlobalDialogManager from '../../helpers/globalDialogManager';
import { getCurrentPageType } from '../locationListener';
import memberAPI from '../../api/member';
const s = require('./profileRegisterForm.scss');

type ProfileRegisterStatus =
  'NOT_SET' | // NOT SET! NEED VERIFICATION
  'NOT_A_MEMBER' | // NEED TO SIGNUP WITH CREATING PROFILE
  'NEED_LOGIN' | // IS A USER! NEED TO LOGIN
  'PROFILE'; // IS A USER! CONTINUE TO CREATE A PROFILE

type ProfileRegisterFormProps = {
  queryParams: ProfileRegisterParams;
}

export type ProfileRegisterFormValues = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  affiliation: Affiliation | SuggestAffiliation;
  profileLink: string;
};

const createProfile = (values: ProfileRegisterFormValues) => {
  const { id: affiliation_id, name: affiliation_name } = values.affiliation as Affiliation;
  profileAPI.createProfile({
    affiliation_id,
    affiliation_name,
    bio: ' ',
    email: values.email,
    first_name: values.firstName,
    last_name: values.lastName,
    is_email_public: true,
    web_page: ' '
  });
}

const createMemberAndProfile = (token: string, values: ProfileRegisterFormValues) => {
  const { id: affiliation_id, name: affiliation_name } = values.affiliation as Affiliation;
  memberAPI.createMemberWithProfile(token, {
    affiliation_id,
    affiliation_name,
    bio: ' ',
    email: values.email,
    first_name: values.firstName,
    last_name: values.lastName,
    is_email_public: true,
    web_page: ' ',
    password: values.password,
  })
}

const SigninContent: FC = () => {
  const openSigninModal = () => {
    GlobalDialogManager.openSignInDialog({
      authContext: {
        pageType: getCurrentPageType(),
        actionArea: 'profileRegister',
        actionLabel: 'profileRegisterSignin',
      },
      isBlocked: false,
    })
  }

  return (
    <>
      <div>
        <p>Sign in to continue</p>
        <Button
          elementType="button"
          variant="contained"
          color="blue"
          onClick={openSigninModal}
        >
          <span>Sign in</span>
        </Button>
      </div>
    </>
  )
}

const ProfileRegisterForm: FC<ProfileRegisterFormProps> = (props) => {
  const { queryParams } = props;
  const currentUser = useSelector<AppState, CurrentUser>(state => state.currentUser);
  const [verificationState, setVerificationState] = useState<TokenVerificationRes | null>(null);

  const formStatus: ProfileRegisterStatus = useMemo(() => {
    if (!verificationState) return 'NOT_SET';
    if (verificationState.isMember && currentUser.isLoggedIn) {
      return 'PROFILE';
    } else if (verificationState.isMember && !currentUser.isLoggedIn) {
      return 'NEED_LOGIN';
    }
    return 'NOT_A_MEMBER';
  }, [currentUser, verificationState]);

  const initialValues: ProfileRegisterFormValues = {
    email: '',
    password: '',
    firstName: currentUser.firstName || '',
    lastName: currentUser.lastName || '',
    affiliation: {
      id: null,
      name: currentUser.affiliationName || '',
      nameAbbrev: null,
    },
    profileLink: '',
  };

  useEffect(() => {
    AffiliationAPI.verifyByToken(queryParams.token).then(res => {
      setVerificationState(res);
    });
  }, [queryParams.token, currentUser]);

  useEffect(() => {
    console.log(formStatus);
  }, [formStatus]);

  const handleSubmit = (values: ProfileRegisterFormValues) => {
    const { id: affiliation_id, name: affiliation_name } = values.affiliation as Affiliation
    if (!affiliation_id || !affiliation_name) {
      return;
    }

    if (formStatus === 'PROFILE') {
      createProfile(values);
    } else if (formStatus === 'NOT_A_MEMBER' && queryParams.token) {
      createMemberAndProfile(queryParams.token, values);
    }
  };

  return (
    <>
      {
        formStatus === 'NEED_LOGIN'
          ? <SigninContent />
          : (
            <Formik initialValues={initialValues} onSubmit={handleSubmit}>
              {formikProps => {
                return (
                  <Form>
                    <AffiliationInputField
                      formikProps={formikProps}
                      profileAffiliation={verificationState && verificationState?.affiliation}
                    />
                    <EmailPasswordFields
                      formikProps={formikProps}
                      needPwd={formStatus !== 'NOT_A_MEMBER'}
                      email={verificationState?.email}
                    />
                    <NameInputFields />
                    <div className={s.formRow}>
                      {formStatus === 'PROFILE' ? (
                        <Button elementType="button" type="submit" color="blue">
                          <span>Create profile</span>
                        </Button>
                      ) : (
                        <Button elementType="button" type="submit" color="blue">
                          <span>Create account & profile</span>
                        </Button>
                      )}
                    </div>
                  </Form>
                );
              }}
            </Formik>
          )
      }
    </>
  );
};

export default withStyles<typeof ProfileRegisterForm>(s)(ProfileRegisterForm);