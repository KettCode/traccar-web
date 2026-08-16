import SelectField from '../../../common/components/SelectField';

const GameLookupSelectField = ({ lookup, ...props }) => (
  <SelectField
    {...props}
    endpoint={`/api/games/lookups/${lookup}`}
    keyGetter={(option) => option.value}
    titleGetter={(option) => option.label}
  />
);

export default GameLookupSelectField;
