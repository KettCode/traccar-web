import { keyframes } from '@emotion/react';
import { useEffect, useState } from 'react';
import { Box, Button, Dialog, Stack, Typography } from '@mui/material';
import { alpha } from '@mui/material/styles';
import GpsFixedIcon from '@mui/icons-material/GpsFixed';
import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import PlaceIcon from '@mui/icons-material/Place';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

const backdropIn = keyframes`
  from { opacity: 0; transform: scale(1.02); }
  to { opacity: 1; transform: scale(1); }
`;

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(14px); }
  to { opacity: 1; transform: translateY(0); }
`;

const radarPulse = keyframes`
  0% { opacity: 0; transform: translate(-50%, -50%) scale(0.62); }
  35% { opacity: 0.55; }
  100% { opacity: 0; transform: translate(-50%, -50%) scale(1.35); }
`;

const radarSweep = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const nameReveal = keyframes`
  0% { opacity: 0; clip-path: inset(0 100% 0 0); filter: blur(10px); letter-spacing: 0.28em; }
  45% { opacity: 1; filter: blur(6px); }
  100% { opacity: 1; clip-path: inset(0 0 0 0); filter: blur(0); letter-spacing: 0.04em; }
`;

const scanLine = keyframes`
  0% { opacity: 0; transform: translateX(-110%); }
  20% { opacity: 1; }
  80% { opacity: 1; }
  100% { opacity: 0; transform: translateX(110%); }
`;

const redactAway = keyframes`
  0% { transform: scaleX(1); opacity: 1; }
  100% { transform: scaleX(0); opacity: 0; }
`;

const iconFloat = keyframes`
  0%, 100% { transform: translateY(0) scale(1); }
  50% { transform: translateY(-6px) scale(1.04); }
`;

const markerPulse = keyframes`
  0%, 100% { opacity: 0.82; transform: translate(-50%, -50%) scale(1); }
  50% { opacity: 1; transform: translate(-50%, -50%) scale(1.18); }
`;

const pingVanish = keyframes`
  0% { opacity: 1; transform: translate(-50%, -50%) scale(1); filter: blur(0); }
  42% { opacity: 0.55; transform: translate(-50%, -50%) scale(1.16); filter: blur(1px); }
  100% { opacity: 0; transform: translate(-50%, -50%) scale(0.14); filter: blur(10px); }
`;

const pingWave = keyframes`
  0% { opacity: 0; transform: translate(-50%, -50%) scale(0.35); }
  28% { opacity: 0.75; }
  100% { opacity: 0; transform: translate(-50%, -50%) scale(1.7); }
`;

const darkSweep = keyframes`
  0% { opacity: 0; transform: translate(-50%, -50%) scale(0.55); }
  28% { opacity: 0.92; }
  100% { opacity: 0; transform: translate(-50%, -50%) scale(1.42); }
`;

const ghostTrace = keyframes`
  from { opacity: 0; transform: translate(-50%, -50%) scale(0.72); }
  to { opacity: 1; transform: translate(-50%, -50%) scale(1); }
`;

const realFlicker = keyframes`
  0%, 36% { opacity: 1; filter: blur(0); }
  43% { opacity: 0.38; filter: blur(2px); }
  50% { opacity: 0.9; filter: blur(0); }
  62% { opacity: 0.24; filter: blur(4px); }
  100% { opacity: 0; filter: blur(10px); }
`;

const textSwap = keyframes`
  from { opacity: 0; transform: translateY(10px) scale(0.96); filter: blur(4px); }
  to { opacity: 1; transform: translateY(0) scale(1); filter: blur(0); }
`;

const getAnimationConfig = (animation, t) => {
  switch (animation.type) {
    case 'reveal_speedhunt':
      return {
        accent: '#ffb74d',
        title: animation.targetName || t('gameJokerAnimationUnknownTarget'),
        prompt: t('gameJokerAnimationRevealSpeedhuntPrompt'),
        privacy: t('gameJokerAnimationRevealSpeedhuntPrivacy'),
        buttonLabel: t('gameJokerAnimationUnderstood'),
      };
    case 'request_hunter_locations':
      return {
        accent: '#4fc3f7',
        title: t('gameJokerAnimationHunterLocationsScanning'),
        completeTitle: t('gameJokerAnimationHunterLocationsFound'),
        buttonLabel: t('gameJokerAnimationOpenMap'),
      };
    case 'skip_ping':
      return {
        accent: '#ce93d8',
        title: t('gameJokerAnimationSkipPingScanning'),
        completeTitle: t('gameJokerAnimationSkipPingTitle'),
        buttonLabel: t('gameJokerAnimationUnderstood'),
      };
    case 'fake_ping':
      return {
        accent: '#81c784',
        title: t('gameJokerAnimationFakePingRouting'),
        completeTitle: t('gameJokerAnimationFakePingTitle'),
        buttonLabel: t('gameJokerAnimationUnderstood'),
      };
    default:
      return {
        accent: '#90caf9',
        kicker: t('gameJoker'),
        title: animation.jokerName || t('gameJokerEffectActive'),
        caption: t('gameJokerAnimationDefaultCaption'),
      };
  }
};

const renderJokerAnimationIcon = (type) => {
  switch (type) {
    case 'reveal_speedhunt':
      return <PersonSearchIcon fontSize="large" />;
    case 'request_hunter_locations':
      return <GpsFixedIcon fontSize="large" />;
    case 'skip_ping':
      return <VisibilityOffIcon fontSize="large" />;
    case 'fake_ping':
      return <PlaceIcon fontSize="large" />;
    default:
      return <GpsFixedIcon fontSize="large" />;
  }
};

const RadarField = ({ accent, active, compact }) => (
  <Box
    sx={{
      position: 'absolute',
      inset: 0,
      display: 'grid',
      placeItems: 'center',
      pointerEvents: 'none',
    }}
  >
    {[0, 1, 2].map((ring) => (
      <Box
        key={ring}
        sx={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          width: compact ? 190 + ring * 44 : 230 + ring * 58,
          height: compact ? 190 + ring * 44 : 230 + ring * 58,
          borderRadius: '50%',
          border: `1px solid ${alpha(accent, active ? 0.3 - ring * 0.05 : 0.2 - ring * 0.03)}`,
          boxShadow: active ? 'none' : `0 0 28px ${alpha(accent, 0.1)}`,
          animation: active
            ? `${radarPulse} ${2400 + ring * 320}ms ease-out ${ring * 180}ms infinite`
            : 'none',
        }}
      />
    ))}
    {active && (
      <Box
        sx={{
          position: 'absolute',
          width: compact ? 210 : 270,
          height: compact ? 210 : 270,
          borderRadius: '50%',
          background: `conic-gradient(from -20deg, ${alpha(accent, 0.42)}, ${alpha(accent, 0.02)} 42deg, transparent 80deg)`,
          maskImage: 'radial-gradient(circle, transparent 0 18%, #000 19% 100%)',
          animation: `${radarSweep} 2600ms linear infinite`,
        }}
      />
    )}
    <Box
      sx={{
        position: 'absolute',
        width: compact ? 210 : 270,
        height: compact ? 210 : 270,
        borderRadius: '50%',
        border: `1px solid ${alpha(accent, 0.38)}`,
        boxShadow: `0 0 48px ${alpha(accent, 0.16)}, inset 0 0 60px ${alpha(accent, 0.08)}`,
      }}
    />
  </Box>
);

const RedactedName = ({ accent, name }) => (
  <Box
    sx={{
      display: 'grid',
      placeItems: 'center',
      width: '100%',
    }}
  >
    <Box
      sx={{
        position: 'relative',
        display: 'inline-grid',
        placeItems: 'center',
        width: 'fit-content',
        maxWidth: '100%',
        mx: 'auto',
        px: { xs: 1, sm: 2 },
        py: 1,
        overflow: 'hidden',
      }}
    >
      <Typography
        variant="h2"
        sx={{
          maxWidth: '100%',
          color: '#fff',
          fontWeight: 950,
          lineHeight: 1.02,
          textAlign: 'center',
          textShadow: `0 0 28px ${alpha(accent, 0.58)}`,
          wordBreak: 'break-word',
          animation: `${nameReveal} 1900ms cubic-bezier(0.16, 1, 0.3, 1) 1750ms both`,
          fontSize: { xs: 40, sm: 64 },
          willChange: 'opacity, clip-path, filter',
        }}
      >
        {name}
      </Typography>
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          background: `linear-gradient(90deg, transparent, ${alpha(accent, 0.86)}, transparent)`,
          filter: 'blur(7px)',
          animation: `${scanLine} 1700ms cubic-bezier(0.16, 1, 0.3, 1) 1700ms both`,
          willChange: 'transform, opacity',
        }}
      />
      {[0, 1, 2].map((bar) => (
        <Box
          key={bar}
          sx={{
            position: 'absolute',
            left: `${8 + bar * 5}%`,
            right: `${10 - bar * 2}%`,
            top: `${24 + bar * 19}%`,
            height: { xs: 10, sm: 13 },
            borderRadius: 999,
            bgcolor: alpha('#030712', 0.92),
            boxShadow: `0 0 18px ${alpha(accent, 0.28)}`,
            transformOrigin: 'right center',
            animation: `${redactAway} 820ms cubic-bezier(0.7, 0, 0.2, 1) ${2100 + bar * 140}ms both`,
            willChange: 'transform, opacity',
          }}
        />
      ))}
    </Box>
  </Box>
);

const MiniMapFrame = ({ children }) => (
  <Box
    sx={{
      position: 'relative',
      width: { xs: 300, sm: 390 },
      height: { xs: 190, sm: 220 },
      mx: 'auto',
      borderRadius: 5,
      overflow: 'hidden',
      border: '1px solid rgba(255, 255, 255, 0.16)',
      background: `
        linear-gradient(120deg, rgba(255,255,255,0.08) 0 1px, transparent 1px 64px),
        linear-gradient(30deg, rgba(255,255,255,0.06) 0 1px, transparent 1px 52px),
        radial-gradient(circle at 24% 34%, rgba(255,255,255,0.11), transparent 22%),
        radial-gradient(circle at 78% 68%, rgba(255,255,255,0.09), transparent 24%),
        rgba(5, 13, 28, 0.74)
      `,
      boxShadow: 'inset 0 0 70px rgba(0, 0, 0, 0.28), 0 24px 90px rgba(0, 0, 0, 0.28)',
    }}
  >
    <Box
      sx={{
        position: 'absolute',
        left: '-8%',
        top: '54%',
        width: '118%',
        height: 20,
        borderRadius: 999,
        bgcolor: 'rgba(255,255,255,0.06)',
        transform: 'rotate(-9deg)',
      }}
    />
    <Box
      sx={{
        position: 'absolute',
        left: '34%',
        top: '-10%',
        width: 18,
        height: '120%',
        borderRadius: 999,
        bgcolor: 'rgba(255,255,255,0.045)',
        transform: 'rotate(18deg)',
      }}
    />
    {children}
  </Box>
);

const MapPing = ({ accent, active, complete, left, top, vanished }) => (
  <Box
    sx={{
      position: 'absolute',
      left,
      top,
      width: 62,
      height: 62,
      transform: 'translate(-50%, -50%)',
      opacity: vanished ? 0 : 1,
      transition: 'opacity 420ms ease',
    }}
  >
    {[0, 1].map((ring) => (
      <Box
        key={ring}
        sx={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          width: 52,
          height: 52,
          borderRadius: '50%',
          border: `1px solid ${alpha(accent, 0.65 - ring * 0.18)}`,
          animation: active
            ? `${pingWave} ${1500 + ring * 220}ms ease-out ${ring * 180}ms infinite`
            : 'none',
        }}
      />
    ))}
    <Box
      sx={{
        position: 'absolute',
        left: '50%',
        top: '50%',
        width: 22,
        height: 22,
        borderRadius: '50%',
        transform: 'translate(-50%, -50%)',
        bgcolor: accent,
        boxShadow: `0 0 28px ${alpha(accent, 0.78)}`,
        animation: complete ? `${markerPulse} 1300ms ease-in-out infinite` : 'none',
      }}
    />
  </Box>
);

const ActionSlot = ({ children }) => (
  <Box sx={{ minHeight: 40, display: 'grid', placeItems: 'center' }}>{children}</Box>
);

const JokerActionButton = ({ accent, children, complete, onClick }) => (
  <Button
    variant="contained"
    size="small"
    onClick={onClick}
    sx={{
      minHeight: 34,
      px: 2.5,
      color: '#071018',
      bgcolor: accent,
      opacity: complete ? 1 : 0,
      pointerEvents: complete ? 'auto' : 'none',
      animation: complete ? `${fadeUp} 520ms ease-out both` : 'none',
      '&:hover': { bgcolor: accent },
    }}
  >
    {children}
  </Button>
);

const JokerStageShell = ({ actionSlot, animationSlot, hintSlot, textSlot }) => (
  <Stack
    spacing={2.25}
    alignItems="center"
    textAlign="center"
    sx={{
      position: 'relative',
      zIndex: 1,
      width: '100%',
      maxWidth: { xs: 'calc(100vw - 32px)', sm: 520 },
      minHeight: { xs: 430, sm: 500 },
      mx: 'auto',
      justifyContent: 'center',
    }}
  >
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        height: { xs: 210, sm: 240 },
        display: 'grid',
        placeItems: 'center',
        overflow: 'visible',
      }}
    >
      {animationSlot}
    </Box>
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        minHeight: { xs: 104, sm: 124 },
        display: 'grid',
        placeItems: 'center',
      }}
    >
      {textSlot}
    </Box>
    <Box sx={{ width: '100%', minHeight: 34, display: 'grid', placeItems: 'center' }}>
      {hintSlot}
    </Box>
    <ActionSlot>{actionSlot}</ActionSlot>
  </Stack>
);

const RevealSpeedhuntStage = ({ config, complete, onClose, t }) => (
  <JokerStageShell
    animationSlot={
      <Box
        sx={{
          width: 70,
          height: 70,
          borderRadius: '50%',
          display: 'grid',
          placeItems: 'center',
          color: '#fff',
          bgcolor: alpha(config.accent, 0.16),
          border: `1px solid ${alpha(config.accent, 0.55)}`,
          boxShadow: `0 0 42px ${alpha(config.accent, 0.34)}`,
          animation: `${iconFloat} 2800ms ease-in-out infinite`,
        }}
      >
        {renderJokerAnimationIcon('reveal_speedhunt')}
      </Box>
    }
    textSlot={
      <Stack spacing={1.5} alignItems="center" sx={{ width: '100%' }}>
        <Typography
          variant="h6"
          sx={{
            color: alpha('#fff', 0.78),
            letterSpacing: '0.16em',
            animation: `${fadeUp} 720ms ease-out 780ms both`,
          }}
        >
          {config.prompt}
        </Typography>
        <RedactedName accent={config.accent} name={config.title} />
      </Stack>
    }
    hintSlot={
      <Typography
        variant="body2"
        textAlign="center"
        sx={{
          maxWidth: 460,
          color: alpha('#fff', 0.74),
          animation: complete ? `${fadeUp} 720ms ease-out both` : 'none',
          opacity: complete ? 1 : 0,
        }}
      >
        {config.privacy}
      </Typography>
    }
    actionSlot={
      <JokerActionButton accent={config.accent} complete={complete} onClick={onClose}>
        {config.buttonLabel || t('gameJokerAnimationContinue')}
      </JokerActionButton>
    }
  />
);

const HunterLocationsStage = ({ complete, config, onClose }) => (
  <JokerStageShell
    animationSlot={
      <>
        <RadarField accent={config.accent} active={!complete} compact />
        <Box
          sx={{
            position: 'relative',
            zIndex: 1,
            width: 84,
            height: 84,
            borderRadius: '50%',
            display: 'grid',
            placeItems: 'center',
            color: '#fff',
            bgcolor: alpha(config.accent, 0.14),
            border: `1px solid ${alpha(config.accent, 0.56)}`,
            boxShadow: `0 0 48px ${alpha(config.accent, 0.32)}`,
            animation: `${iconFloat} 2300ms ease-in-out infinite`,
          }}
        >
          {renderJokerAnimationIcon('request_hunter_locations')}
        </Box>
      </>
    }
    textSlot={
      <Box sx={{ position: 'relative', minHeight: { xs: 68, sm: 82 }, width: '100%' }}>
        <Typography
          variant="h5"
          sx={{
            position: 'absolute',
            inset: 0,
            display: 'grid',
            placeItems: 'center',
            mx: 'auto',
            color: alpha('#fff', 0.82),
            fontWeight: 800,
            lineHeight: 1.08,
            textAlign: 'center',
            textShadow: `0 0 22px ${alpha(config.accent, 0.36)}`,
            opacity: complete ? 0 : 1,
            transform: complete ? 'translateY(-10px) scale(0.97)' : 'translateY(0) scale(1)',
            transition: 'opacity 360ms ease, transform 360ms ease',
            fontSize: { xs: 24, sm: 34 },
          }}
        >
          {config.title}
        </Typography>
        {complete && (
          <Typography
            variant="h5"
            sx={{
              position: 'absolute',
              inset: 0,
              display: 'grid',
              placeItems: 'center',
              mx: 'auto',
              color: '#fff',
              fontWeight: 800,
              lineHeight: 1.08,
              textAlign: 'center',
              textShadow: `0 0 24px ${alpha(config.accent, 0.5)}`,
              animation: `${textSwap} 520ms ease-out both`,
              fontSize: { xs: 24, sm: 34 },
            }}
          >
            {config.completeTitle}
          </Typography>
        )}
      </Box>
    }
    hintSlot={null}
    actionSlot={
      <JokerActionButton accent={config.accent} complete={complete} onClick={onClose}>
        {config.buttonLabel}
      </JokerActionButton>
    }
  />
);

const SkipPingStage = ({ complete, config, onClose }) => (
  <JokerStageShell
    animationSlot={
      <MiniMapFrame>
        {complete && (
          <Box
            sx={{
              position: 'absolute',
              left: '50%',
              top: '52%',
              width: 130,
              height: 130,
              borderRadius: '50%',
              background: `radial-gradient(circle, rgba(3, 7, 18, 0.98), ${alpha(config.accent, 0.18)} 52%, transparent 72%)`,
              boxShadow: `0 0 42px ${alpha(config.accent, 0.26)}`,
              animation: `${darkSweep} 760ms ease-in both`,
            }}
          />
        )}
        <Box
          sx={{
            position: 'absolute',
            left: '50%',
            top: '52%',
            width: 74,
            height: 74,
            transform: 'translate(-50%, -50%)',
            animation: complete ? `${pingVanish} 780ms ease-in both` : 'none',
          }}
        >
          <MapPing accent={config.accent} active={!complete} left="50%" top="50%" />
        </Box>
        {complete && (
          <Box
            sx={{
              position: 'absolute',
              left: '50%',
              top: '52%',
              width: 76,
              height: 76,
              borderRadius: '50%',
              border: `1px dashed ${alpha(config.accent, 0.46)}`,
              boxShadow: `inset 0 0 26px ${alpha(config.accent, 0.12)}`,
              transform: 'translate(-50%, -50%)',
              animation: `${ghostTrace} 520ms ease-out 360ms both`,
              opacity: 0,
            }}
          />
        )}
      </MiniMapFrame>
    }
    textSlot={
      <Typography
        variant="h4"
        sx={{
          color: '#fff',
          fontWeight: 900,
          textShadow: `0 0 24px ${alpha(config.accent, 0.52)}`,
          animation: complete ? `${textSwap} 520ms ease-out both` : `${fadeUp} 720ms ease-out both`,
          fontSize: { xs: 30, sm: 44 },
        }}
      >
        {complete ? config.completeTitle : config.title}
      </Typography>
    }
    hintSlot={null}
    actionSlot={
      <JokerActionButton accent={config.accent} complete={complete} onClick={onClose}>
        {config.buttonLabel}
      </JokerActionButton>
    }
  />
);

const FakePingStage = ({ complete, config, onClose }) => (
  <JokerStageShell
    animationSlot={
      <MiniMapFrame>
        <Box
          sx={{
            position: 'absolute',
            left: '34%',
            top: '52%',
            width: 74,
            height: 74,
            transform: 'translate(-50%, -50%)',
            animation: complete ? `${realFlicker} 700ms ease-in both` : 'none',
          }}
        >
          <MapPing accent="#ef5350" active={!complete} left="50%" top="50%" />
        </Box>
        {complete && (
          <Box
            sx={{
              position: 'absolute',
              left: '34%',
              top: '52%',
              width: 68,
              height: 68,
              borderRadius: '50%',
              border: `1px dashed ${alpha('#ef5350', 0.34)}`,
              transform: 'translate(-50%, -50%)',
              animation: `${ghostTrace} 480ms ease-out 420ms both`,
              opacity: 0,
            }}
          />
        )}
        <Box
          sx={{
            position: 'absolute',
            left: '66%',
            top: '52%',
            width: 86,
            height: 86,
            opacity: complete ? 1 : 0,
            transform: complete
              ? 'translate(-50%, -50%) scale(1)'
              : 'translate(-50%, -50%) scale(0.42)',
            filter: complete ? 'blur(0)' : 'blur(8px)',
            transition:
              'opacity 520ms ease 220ms, transform 520ms cubic-bezier(0.16, 1, 0.3, 1) 220ms, filter 520ms ease 220ms',
          }}
        >
          <MapPing
            accent={config.accent}
            active={complete}
            complete={complete}
            left="50%"
            top="50%"
          />
        </Box>
      </MiniMapFrame>
    }
    textSlot={
      <Typography
        variant="h4"
        sx={{
          color: '#fff',
          fontWeight: 900,
          textShadow: `0 0 24px ${alpha(config.accent, 0.52)}`,
          animation: complete ? `${textSwap} 520ms ease-out both` : `${fadeUp} 720ms ease-out both`,
          fontSize: { xs: 30, sm: 44 },
        }}
      >
        {complete ? config.completeTitle : config.title}
      </Typography>
    }
    hintSlot={null}
    actionSlot={
      <JokerActionButton accent={config.accent} complete={complete} onClick={onClose}>
        {config.buttonLabel}
      </JokerActionButton>
    }
  />
);

const GenericJokerStage = ({ animation, config, complete, onClose, t }) => (
  <Stack
    spacing={2.25}
    alignItems="center"
    textAlign="center"
    sx={{ position: 'relative', zIndex: 1 }}
  >
    <Box
      sx={{
        width: 72,
        height: 72,
        borderRadius: '50%',
        display: 'grid',
        placeItems: 'center',
        color: '#fff',
        bgcolor: alpha(config.accent, 0.18),
        border: `1px solid ${alpha(config.accent, 0.62)}`,
        boxShadow: `0 0 44px ${alpha(config.accent, 0.38)}`,
        animation: `${iconFloat} 2600ms ease-in-out infinite`,
      }}
    >
      {renderJokerAnimationIcon(animation.type)}
    </Box>
    <Typography
      variant="overline"
      sx={{ color: alpha('#fff', 0.72), letterSpacing: '0.32em', fontWeight: 800 }}
    >
      {config.kicker}
    </Typography>
    <Typography
      variant="h3"
      sx={{
        maxWidth: '100%',
        fontWeight: 900,
        lineHeight: 1.05,
        textShadow: `0 0 26px ${alpha(config.accent, 0.62)}`,
        wordBreak: 'break-word',
        animation: `${fadeUp} 700ms ease-out both`,
        fontSize: { xs: 34, sm: 54 },
      }}
    >
      {config.title}
    </Typography>
    {config.caption && (
      <Typography variant="body2" sx={{ maxWidth: 420, color: alpha('#fff', 0.72) }}>
        {config.caption}
      </Typography>
    )}
    {complete && (
      <Button
        variant="contained"
        onClick={onClose}
        sx={{
          px: 4,
          color: '#071018',
          bgcolor: config.accent,
          '&:hover': { bgcolor: config.accent },
        }}
      >
        {config.buttonLabel || t('gameJokerAnimationContinue')}
      </Button>
    )}
  </Stack>
);

const GameJokerAnimationOverlay = ({ animation, onClose, t }) => {
  const [phase, setPhase] = useState('intro');

  useEffect(() => {
    if (!animation) {
      return undefined;
    }

    setPhase('intro');
    if (animation.type === 'request_hunter_locations') {
      const completeTimeout = setTimeout(() => setPhase('complete'), 3200);
      return () => clearTimeout(completeTimeout);
    }
    if (animation.type === 'reveal_speedhunt') {
      const completeTimeout = setTimeout(() => setPhase('complete'), 3800);
      return () => clearTimeout(completeTimeout);
    }
    if (animation.type === 'skip_ping' || animation.type === 'fake_ping') {
      const completeTimeout = setTimeout(() => setPhase('complete'), 2400);
      return () => clearTimeout(completeTimeout);
    }

    const completeTimeout = setTimeout(() => setPhase('complete'), 600);
    return () => clearTimeout(completeTimeout);
  }, [animation, onClose]);

  if (!animation) {
    return null;
  }

  const config = getAnimationConfig(animation, t);
  const revealSpeedhunt = animation.type === 'reveal_speedhunt';
  const hunterLocationScan = animation.type === 'request_hunter_locations';
  const skipPing = animation.type === 'skip_ping';
  const fakePing = animation.type === 'fake_ping';
  const complete = phase === 'complete';

  return (
    <Dialog
      open
      fullScreen
      onClose={hunterLocationScan ? undefined : onClose}
      slotProps={{
        paper: {
          sx: { bgcolor: 'transparent', boxShadow: 'none', overflow: 'hidden' },
        },
        backdrop: {
          sx: { bgcolor: 'rgba(3, 7, 18, 0.9)', backdropFilter: 'blur(12px)' },
        },
      }}
    >
      <Box
        sx={(theme) => ({
          minHeight: '100%',
          display: 'grid',
          placeItems: 'center',
          p: { xs: 2, sm: 4 },
          color: '#fff',
          background: `radial-gradient(circle at 50% 46%, ${alpha(config.accent, 0.2)}, transparent 36%), linear-gradient(135deg, ${alpha(theme.palette.common.black, 0.96)}, ${alpha(theme.palette.primary.dark, 0.5)})`,
          animation: `${backdropIn} 420ms ease-out both`,
          '@media (prefers-reduced-motion: reduce)': {
            '&, & *': {
              animationDuration: '1ms !important',
              animationIterationCount: '1 !important',
              transitionDuration: '1ms !important',
            },
          },
        })}
      >
        <Box
          sx={{
            position: 'relative',
            width: { xs: 'calc(100vw - 32px)', sm: 560 },
            maxWidth: '100%',
            minHeight: { xs: 440, sm: 520 },
            display: 'grid',
            placeItems: 'center',
            textAlign: 'center',
          }}
        >
          {revealSpeedhunt && (
            <RevealSpeedhuntStage config={config} complete={complete} onClose={onClose} t={t} />
          )}
          {hunterLocationScan && (
            <HunterLocationsStage complete={complete} config={config} onClose={onClose} />
          )}
          {skipPing && <SkipPingStage complete={complete} config={config} onClose={onClose} />}
          {fakePing && <FakePingStage complete={complete} config={config} onClose={onClose} />}
          {!revealSpeedhunt && !hunterLocationScan && !skipPing && !fakePing && (
            <GenericJokerStage
              animation={animation}
              config={config}
              complete={complete}
              onClose={onClose}
              t={t}
            />
          )}
        </Box>
      </Box>
    </Dialog>
  );
};

export default GameJokerAnimationOverlay;
