import { ReloadIcon } from '@radix-ui/react-icons';
import { Button } from './ui/button';
import { useNavigation } from '@remix-run/react';

// Write jsdocs for the component
/**
 * Submit button component
 * @param {object} props - The props object
 * @param {React.ReactNode} props.children - The children of the component
 * @param {boolean} [props.isSubmitting] - The isSubmitting state of the component. If not provided, it will be determined by the navigation state
 * @returns {React.ReactElement} The SubmitButton component
 */
const SubmitButton = ({
  children,
  isSubmitting,
}: {
  children: React.ReactNode;
  isSubmitting?: boolean;
}) => {
  const navigation = useNavigation();
  isSubmitting ??= navigation.state === 'submitting';
  return (
    <Button type="submit">
      {isSubmitting ? (
        <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
      ) : null}
      {children}
    </Button>
  );
};

export default SubmitButton;
