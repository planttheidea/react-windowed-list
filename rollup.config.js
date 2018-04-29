import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve';
import uglify from 'rollup-plugin-uglify';

export default [
  {
    external: ['react', 'react-dom', 'remeasure'],
    input: 'src/index.js',
    output: {
      exports: 'named',
      file: 'dist/react-windowed-list.js',
      format: 'umd',
      globals: {
        react: 'React',
        'react-dom': 'ReactDOM',
        remeasure: 'Remeasure'
      },
      name: 'WindowedList',
      sourcemap: true
    },
    plugins: [
      commonjs({
        include: 'node_modules/**'
      }),
      resolve({
        main: true,
        module: true
      }),
      babel({
        exclude: 'node_modules/**'
      })
    ]
  },
  {
    external: ['react', 'react-dom', 'remeasure'],
    input: 'src/index.js',
    output: {
      exports: 'named',
      file: 'dist/react-windowed-list.min.js',
      format: 'umd',
      globals: {
        react: 'React',
        'react-dom': 'ReactDOM',
        remeasure: 'Remeasure'
      },
      name: 'WindowedList'
    },
    plugins: [
      commonjs({
        include: 'node_modules/**'
      }),
      resolve({
        main: true,
        module: true
      }),
      babel({
        exclude: 'node_modules/**'
      }),
      uglify()
    ]
  }
];
