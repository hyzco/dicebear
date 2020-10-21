import inquirer from 'inquirer';
import globby from 'globby';
import path from 'path';
import fs from 'fs-extra';
import ora from 'ora';

interface Options {}

export default async function (target: string, options: Options) {
  const answers = await inquirer.prompt([
    {
      name: 'name',
      type: 'input',
      message: 'Style name',
      default: path.basename(target),
    },
    {
      name: 'authorName',
      type: 'input',
      message: 'Author name',
      default: 'John Doe',
    },
    {
      name: 'authorEmail',
      type: 'input',
      message: 'Author email',
    },
    {
      name: 'repo',
      type: 'input',
      message: 'Repository name',
      default: 'user/repo',
    },
  ]);

  const spinner = ora('Create sprite project').start();

  const source = path.join(__dirname, '../templates/style');
  const files = await globby(['**/*'], { cwd: source });

  const replacements: Record<string, string> = {
    name: answers.name,
    uc_name: answers.name.charAt(0).toUpperCase() + answers.name.slice(1),
    author_name: answers.authorName,
    author_email: answers.authorEmail,
    repo: answers.repo,
    year: new Date().getFullYear().toString(),
  };

  await Promise.all(
    files.map(async (file) => {
      let content = await fs.readFile(path.join(source, file), {
        encoding: 'utf-8',
      });

      Object.keys(replacements).forEach((key) => {
        content = content.split(`{{${key}}}`).join(replacements[key]);
      });

      const fileTarget = path.join(process.cwd(), target, file);

      await fs.ensureDir(path.dirname(fileTarget));
      await fs.writeFile(fileTarget, content, {
        encoding: 'utf-8',
      });
    })
  );

  spinner.succeed('Sprite project created.');
}
