import { useEffect } from "react";
import { useDispatch } from "react-redux";

import { openModal } from "~/renderer/actions/modals";
import { isAcceptedTerms, acceptTerms } from "~/renderer/terms";

const IsTermOfUseUpdated = () => {
  const dispatch = useDispatch();
  const shouldOpenModal = !isAcceptedTerms();

  useEffect(() => {
    if (shouldOpenModal) {
      dispatch(openModal("MODAL_TERM_OF_USE_UPDATE", { acceptTerms }));
    }
  }, [shouldOpenModal, dispatch]);

  return null;
};

export default IsTermOfUseUpdated;
