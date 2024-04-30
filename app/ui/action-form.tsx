interface ActionFormProps {
  actions: string[];
}

export default function ActionForm(props: ActionFormProps) {
  const { actions } = props;
  return (
    <form>
      <input
        type="number"
        id="amount"
        name="amount"
        placeholder="enter bet amount."
      />
      {actions.map((action) => {
        return <input key={action} type="submit" name={action} id={action} />;
      })}
    </form>
  );
}
