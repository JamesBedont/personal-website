import UnderConstruction from 'components/underConstruction';
import Layout from 'components/layout';

const ProjectsPage = () => {
  return (
    <Layout title={'Projects'} description={"James Bedont's projects"}>
      <UnderConstruction />
    </Layout>
  );
};

export const config = { unstable_runtimeJS: false}
export default ProjectsPage;
