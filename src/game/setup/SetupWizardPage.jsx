import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import PageLayout from '../../common/components/PageLayout';
import { useTranslation } from '../../common/components/LocalizationProvider';
import GameSetupMenu from './GameSetupMenu';
import useSetupWizard from './hooks/useSetupWizard';
import SetupWizardLayout from './components/SetupWizardLayout';
import SetupGameStep from './components/SetupGameStep';
import SetupPlayersStep from './components/SetupPlayersStep';
import SetupGeofencesStep from './components/SetupGeofencesStep';
import SetupReviewStep from './components/SetupReviewStep';
import SetupMemberDialog from './components/SetupMemberDialog';
import SetupGeofenceDialog from './components/SetupGeofenceDialog';

const SetupWizardPage = () => {
  const t = useTranslation();
  const navigate = useNavigate();
  const { gameId } = useParams();
  const numericGameId = gameId ? Number(gameId) : 0;

  const wizard = useSetupWizard(numericGameId, navigate);
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      label: t('gameSetupGeneral'),
      description: t('gameSetupGeneralDescription'),
      content: <SetupGameStep wizard={wizard} />,
    },
    {
      label: t('gamePlayer'),
      description: t('gameSetupPlayersDescription'),
      content: <SetupPlayersStep wizard={wizard} />,
    },
    {
      label: t('sharedGeofence'),
      description: t('gameSetupGeofencesDescription'),
      content: <SetupGeofencesStep wizard={wizard} />,
    },
    {
      label: t('gameSetupReview'),
      description: t('gameSetupReviewDescription'),
      content: <SetupReviewStep wizard={wizard} />,
    },
  ];

  const handleNext = async () => {
    if (activeStep === 0 && wizard.editable) {
      const saved = await wizard.saveGame();
      if (!saved) {
        return;
      }
    }
    setActiveStep(activeStep + 1);
  };

  return (
    <PageLayout menu={<GameSetupMenu />} breadcrumbs={['gameSetup', 'gameSetupWizard']}>
      <SetupWizardLayout
        steps={steps}
        activeStep={activeStep}
        setActiveStep={setActiveStep}
        loading={wizard.loading}
        game={wizard.game}
        canContinue={!!wizard.game.name && (activeStep === 0 || !!numericGameId)}
        onNext={handleNext}
      >
        {steps[activeStep].content}
      </SetupWizardLayout>
      <SetupMemberDialog wizard={wizard} />
      <SetupGeofenceDialog wizard={wizard} />
    </PageLayout>
  );
};

export default SetupWizardPage;
